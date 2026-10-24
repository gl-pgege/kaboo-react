import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AbstractAgent, EventType, type BaseEvent, type Message, type RunAgentInput } from "@ag-ui/client";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { Observable } from "rxjs";
import { useState } from "react";
import { useAskUserTool } from "./useAskUserTool";
import { useRequestTool, type KabooRequestRenderProps } from "./useRequestTool";
import { toolSchema } from "./schema";
import { MOVED_ON_ANSWER } from "./openRequests";
import { KabooChat } from "../integrations/KabooChat";
import { KabooActivityProvider } from "../context/ActivityProvider";

type Script = (input: RunAgentInput) => BaseEvent[];

const inputs: RunAgentInput[] = [];

class ScriptedAgent extends AbstractAgent {
  constructor(private readonly scripts: Script[]) {
    super({ agentId: "lab", threadId: "t1" });
  }

  run(input: RunAgentInput): Observable<BaseEvent> {
    inputs.push(structuredClone(input));
    const script = this.scripts[inputs.length - 1] ?? finishOnly;
    return new Observable<BaseEvent>((subscriber) => {
      for (const event of script(input)) subscriber.next(event);
      subscriber.complete();
    });
  }

  clone(): ScriptedAgent {
    const copy = new ScriptedAgent(this.scripts);
    copy.agentId = this.agentId;
    copy.threadId = this.threadId;
    copy.messages = structuredClone(this.messages);
    return copy;
  }
}

const ev = (event: Record<string, unknown>) => event as unknown as BaseEvent;
const started = (input: RunAgentInput) => ev({ type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId });
const finished = (input: RunAgentInput, outcome?: Record<string, unknown>) =>
  ev({ type: EventType.RUN_FINISHED, threadId: input.threadId, runId: input.runId, ...(outcome ? { outcome } : {}) });
const finishOnly: Script = (input) => [started(input), finished(input)];

function asking(args: unknown): Script {
  return (input) => [
    started(input),
    ev({ type: EventType.TOOL_CALL_START, toolCallId: "q1", toolCallName: "ask_user", parentMessageId: "m1" }),
    ev({ type: EventType.TOOL_CALL_ARGS, toolCallId: "q1", delta: JSON.stringify(args) }),
    ev({ type: EventType.TOOL_CALL_END, toolCallId: "q1" }),
    finished(input, { type: "success", pendingToolCallIds: ["q1"] }),
  ];
}

function Chat({ kaboo }: { kaboo?: boolean }) {
  useAskUserTool();
  return kaboo ? <KabooChat agentId="lab" threadId="t1" /> : <CopilotChat agentId="lab" threadId="t1" />;
}

function renderChat(scripts: Script[], kaboo = false) {
  inputs.length = 0;
  render(
    <CopilotKitProvider agents__unsafe_dev_only={{ lab: new ScriptedAgent(scripts) }}>
      <KabooActivityProvider agentId="lab">
        <Chat kaboo={kaboo} />
      </KabooActivityProvider>
    </CopilotKitProvider>,
  );
}

function send(text: string) {
  const box = screen.getAllByRole("textbox").find((element) => element.tagName === "TEXTAREA")!;
  fireEvent.change(box, { target: { value: text } });
  fireEvent.keyDown(box, { key: "Enter", code: "Enter" });
}

function toolResults(messages: Message[]) {
  return messages.flatMap((message) => (message.role === "tool" ? [[message.toolCallId, message.content]] : []));
}

describe("useAskUserTool", () => {
  it("shows the question, sends the answer and takes the agent's follow-up run", async () => {
    renderChat([asking({ questions: [{ question: "Which region?", options: ["Europe", "APAC"] }] })]);
    send("Revenue?");

    fireEvent.click(await screen.findByLabelText("Europe"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(inputs).toHaveLength(2));
    expect(toolResults(inputs[1].messages)).toEqual([["q1", JSON.stringify({ "Which region?": "Europe" })]]);
  });

  it("answers a malformed call with its problems so the agent can retry", async () => {
    renderChat([asking({ questions: [] })]);
    send("Revenue?");

    await waitFor(() => expect(inputs).toHaveLength(2));
    expect(toolResults(inputs[1].messages)).toEqual([
      ["q1", "Error: invalid arguments. questions must be a list of at least one question"],
    ]);
  });

  it("skips the open question when the person sends a new message from KabooChat", async () => {
    renderChat([asking({ questions: [{ question: "Which region?", options: ["Europe", "APAC"] }] })], true);
    send("Revenue?");
    await screen.findByLabelText("Europe");

    send("Churn instead");

    await waitFor(() => expect(inputs).toHaveLength(3));
    expect(toolResults(inputs[1].messages)).toEqual([["q1", MOVED_ON_ANSWER]]);
    const last = inputs[2].messages.at(-1);
    expect([last?.role, last?.content]).toEqual(["user", "Churn instead"]);
  });

  it("brings a sub-agent's question into the main transcript, labelled with the agent", async () => {
    const tag = { subagentRunId: "sub-a" };
    renderChat(
      [
        (input) => [
          started(input),
          ev({ type: EventType.TOOL_CALL_START, toolCallId: "d1", toolCallName: "analyst", parentMessageId: "m0" }),
          ev({ type: EventType.TOOL_CALL_ARGS, toolCallId: "d1", delta: '{"task":"Revenue"}' }),
          ev({ type: EventType.TOOL_CALL_END, toolCallId: "d1" }),
          ev({ type: EventType.SUBAGENT_STARTED, name: "analyst", parentToolCallId: "d1", metadata: { title: "Revenue analyst" }, ...tag }),
          ev({ type: EventType.TOOL_CALL_START, toolCallId: "q1", toolCallName: "ask_user", parentMessageId: "m1", ...tag }),
          ev({ type: EventType.TOOL_CALL_ARGS, toolCallId: "q1", delta: '{"questions":[{"question":"Which region?","options":["Europe","APAC"]}]}', ...tag }),
          ev({ type: EventType.TOOL_CALL_END, toolCallId: "q1", ...tag }),
          ev({ type: EventType.SUBAGENT_FINISHED, outcome: { type: "suspended", interruptIds: [] }, ...tag }),
          finished(input, { type: "success", pendingToolCallIds: ["q1"] }),
        ],
      ],
      true,
    );
    send("Revenue?");

    fireEvent.click(await screen.findByLabelText("APAC"));
    expect(screen.getByText("Revenue analyst")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(inputs).toHaveLength(2));
    expect(toolResults(inputs[1].messages)).toEqual([["q1", JSON.stringify({ "Which region?": "APAC" })]]);
    await waitFor(() => expect(document.querySelector(".kaboo-request-from-agent")).toBeNull());
  });

  it("brings requests up one at a time, in the order they were asked", async () => {
    const question = (toolCallId: string, text: string, options: string[]) => [
      ev({ type: EventType.TOOL_CALL_START, toolCallId, toolCallName: "ask_user", parentMessageId: "m1" }),
      ev({ type: EventType.TOOL_CALL_ARGS, toolCallId, delta: JSON.stringify({ questions: [{ question: text, options }] }) }),
      ev({ type: EventType.TOOL_CALL_END, toolCallId }),
    ];
    renderChat([
      (input) => [
        started(input),
        ...question("q1", "Which region?", ["Europe", "APAC"]),
        ...question("q2", "Which year?", ["2025", "2026"]),
        finished(input, { type: "success", pendingToolCallIds: ["q1", "q2"] }),
      ],
    ]);
    send("Revenue?");

    fireEvent.click(await screen.findByLabelText("Europe"));
    expect(screen.queryByLabelText("2026")).toBeNull();
    expect(screen.getByText("Up next, once the request above is answered.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    fireEvent.click(await screen.findByLabelText("2026"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(inputs).toHaveLength(2));
    expect(toolResults(inputs[1].messages)).toEqual([
      ["q1", JSON.stringify({ "Which region?": "Europe" })],
      ["q2", JSON.stringify({ "Which year?": "2026" })],
    ]);
  });

  it("renders a request panel that keeps its own state", async () => {
    inputs.length = 0;
    const parameters = toolSchema<{ reason: string }>({ type: "object" }, () => []);
    function PickPanel({ args, status, answer }: KabooRequestRenderProps<{ reason: string }>) {
      const [picked, setPicked] = useState("");
      if (status !== "waiting") return <p>Picked.</p>;
      return (
        <div>
          <p>{args.reason}</p>
          <button type="button" onClick={() => setPicked("warehouse")}>Warehouse</button>
          <button type="button" disabled={!picked} onClick={() => answer({ picked })}>Use it</button>
        </div>
      );
    }
    function PickChat() {
      useRequestTool({ name: "pick_source", description: "Pick a source.", parameters, render: PickPanel });
      return <CopilotChat agentId="lab" threadId="t1" />;
    }
    const agent = new ScriptedAgent([
      (input) => [
        started(input),
        ev({ type: EventType.TOOL_CALL_START, toolCallId: "p1", toolCallName: "pick_source", parentMessageId: "m1" }),
        ev({ type: EventType.TOOL_CALL_ARGS, toolCallId: "p1", delta: '{"reason":"Where is churn?"}' }),
        ev({ type: EventType.TOOL_CALL_END, toolCallId: "p1" }),
        finished(input, { type: "success", pendingToolCallIds: ["p1"] }),
      ],
    ]);
    render(
      <CopilotKitProvider agents__unsafe_dev_only={{ lab: agent }}>
        <PickChat />
      </CopilotKitProvider>,
    );
    send("Churn?");

    fireEvent.click(await screen.findByRole("button", { name: "Warehouse" }));
    fireEvent.click(screen.getByRole("button", { name: "Use it" }));

    await waitFor(() => expect(inputs).toHaveLength(2));
    expect(toolResults(inputs[1].messages)).toEqual([["p1", JSON.stringify({ picked: "warehouse" })]]);
    expect(await screen.findByText("Picked.")).toBeInTheDocument();
  });
});
