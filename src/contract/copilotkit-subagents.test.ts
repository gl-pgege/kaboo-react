import { describe, expect, it } from "vitest";
import { AbstractAgent, EventType, type BaseEvent, type Message, type RunAgentInput } from "@ag-ui/client";
import { CopilotKitCore } from "@copilotkit/core";
import { Observable } from "rxjs";

type Script = (input: RunAgentInput) => BaseEvent[];

class ScriptedAgent extends AbstractAgent {
  readonly inputs: RunAgentInput[] = [];

  constructor(private readonly scripts: Script[]) {
    super({ agentId: "lab", threadId: "t1" });
  }

  run(input: RunAgentInput): Observable<BaseEvent> {
    this.inputs.push(structuredClone(input));
    const script = this.scripts[this.inputs.length - 1] ?? finishOnly;
    return new Observable<BaseEvent>((subscriber) => {
      for (const event of script(input)) subscriber.next(event);
      subscriber.complete();
    });
  }
}

const ev = (event: Record<string, unknown>) => event as unknown as BaseEvent;
const started = (input: RunAgentInput) => ev({ type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId });
const finished = (input: RunAgentInput, outcome?: Record<string, unknown>) =>
  ev({ type: EventType.RUN_FINISHED, threadId: input.threadId, runId: input.runId, ...(outcome ? { outcome } : {}) });
const finishOnly: Script = (input) => [started(input), finished(input)];

function subagentQuestion(subagentRunId: string, name: string, toolCallId: string, question: string): BaseEvent[] {
  return [
    ev({ type: EventType.SUBAGENT_STARTED, subagentRunId, name }),
    ev({ type: EventType.TOOL_CALL_START, toolCallId, toolCallName: "ask_user", parentMessageId: `m-${toolCallId}`, subagentRunId }),
    ev({ type: EventType.TOOL_CALL_ARGS, toolCallId, delta: JSON.stringify({ question }), subagentRunId }),
    ev({ type: EventType.TOOL_CALL_END, toolCallId, subagentRunId }),
    ev({ type: EventType.SUBAGENT_FINISHED, subagentRunId }),
  ];
}

async function until(check: () => boolean, label: string) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (check()) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error(`timed out waiting for ${label}`);
}

function toolResults(messages: Message[]) {
  return messages.filter((message) => message.role === "tool").map((message) => [message.toolCallId, message.content]);
}

describe("CopilotKit 1.79 with sub-agent-tagged events", () => {
  it("runs human-in-the-loop calls tagged to sub-agents, one at a time, and follows up once after every answer", async () => {
    const agent = new ScriptedAgent([
      (input) => [
        started(input),
        ...subagentQuestion("sub-a", "revenue_analyst", "q1", "Which region?"),
        ...subagentQuestion("sub-b", "churn_analyst", "q2", "Which months?"),
        finished(input, { type: "success", pendingToolCallIds: ["q1", "q2"] }),
      ],
    ]);
    const asked: { args: unknown; answer: (value: unknown) => void }[] = [];
    const core = new CopilotKitCore({
      agents__unsafe_dev_only: { lab: agent },
      tools: [
        {
          name: "ask_user",
          type: "human-in-the-loop",
          handler: (args) => new Promise((answer) => asked.push({ args, answer })),
        },
      ],
    });

    agent.addMessage({ id: "u1", role: "user", content: "Revenue and churn?" });
    const done = core.runAgent({ agent });

    await until(() => asked.length === 1, "the first question");
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(asked).toHaveLength(1);
    expect(asked[0].args).toEqual({ question: "Which region?" });
    asked[0].answer("Europe");

    await until(() => asked.length === 2, "the second question");
    expect(agent.inputs).toHaveLength(1);
    asked[1].answer("This year");

    await done;
    expect(agent.inputs).toHaveLength(2);
    expect(toolResults(agent.inputs[1].messages)).toEqual([
      ["q1", "Europe"],
      ["q2", "This year"],
    ]);
    const tagged = agent.messages.filter((message) => message.role === "assistant" && message.toolCalls?.length);
    expect(tagged.map((message) => (message as { subagentRunId?: string }).subagentRunId)).toEqual(["sub-a", "sub-b"]);
  });

  it("drops sub-agent messages a conversation snapshot leaves out, and keeps the ones it carries", async () => {
    const subagentText = (input: RunAgentInput, snapshot: Message[]) => [
      started(input),
      ev({ type: EventType.SUBAGENT_STARTED, subagentRunId: "sub-a", name: "analyst" }),
      ev({ type: EventType.TEXT_MESSAGE_START, messageId: "s1", role: "assistant", subagentRunId: "sub-a" }),
      ev({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: "s1", delta: "Saved q_3.", subagentRunId: "sub-a" }),
      ev({ type: EventType.TEXT_MESSAGE_END, messageId: "s1", subagentRunId: "sub-a" }),
      ev({ type: EventType.SUBAGENT_FINISHED, subagentRunId: "sub-a" }),
      ev({ type: EventType.TEXT_MESSAGE_START, messageId: "a1", role: "assistant" }),
      ev({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: "a1", delta: "Done." }),
      ev({ type: EventType.TEXT_MESSAGE_END, messageId: "a1" }),
      ev({ type: EventType.MESSAGES_SNAPSHOT, messages: snapshot }),
      finished(input),
    ];
    const user: Message = { id: "u1", role: "user", content: "Go" };
    const reply: Message = { id: "a1", role: "assistant", content: "Done." };
    const subagentMessage = { id: "s1", role: "assistant", content: "Saved q_3.", subagentRunId: "sub-a" } as Message;

    const omitting = new ScriptedAgent([(input) => subagentText(input, [user, reply])]);
    const core = new CopilotKitCore({ agents__unsafe_dev_only: { lab: omitting } });
    omitting.addMessage(user);
    await core.runAgent({ agent: omitting });
    expect(omitting.messages.map((message) => message.id)).toEqual(["u1", "a1"]);

    const carrying = new ScriptedAgent([(input) => subagentText(input, [user, subagentMessage, reply])]);
    const second = new CopilotKitCore({ agents__unsafe_dev_only: { lab: carrying } });
    carrying.addMessage(user);
    await second.runAgent({ agent: carrying });
    expect(carrying.messages.map((message) => [message.id, (message as { subagentRunId?: string }).subagentRunId])).toEqual([
      ["u1", undefined],
      ["s1", "sub-a"],
      ["a1", undefined],
    ]);
  });

  it("rejects a run that finishes while a sub-agent is still open", async () => {
    const agent = new ScriptedAgent([
      (input) => [
        started(input),
        ev({ type: EventType.SUBAGENT_STARTED, subagentRunId: "sub-a", name: "analyst" }),
        finished(input),
      ],
    ]);
    const errors: string[] = [];
    agent.subscribe({ onRunFailed: ({ error }) => void errors.push(error.message) });
    await expect(agent.runAgent({})).rejects.toThrow(/subagent/i);
  });
});
