import { describe, expect, it } from "vitest";
import { AbstractAgent, EventType, type BaseEvent, type Message, type RunAgentInput } from "@ag-ui/client";
import { CopilotKitCore } from "@copilotkit/core";
import { Observable } from "rxjs";
import { MOVED_ON_ANSWER, saveAnswer, skipOpenRequests } from "../requests/openRequests";

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

function question(toolCallId: string, subagentRunId?: string): BaseEvent[] {
  const tag = subagentRunId ? { subagentRunId } : {};
  return [
    ...(subagentRunId ? [ev({ type: EventType.SUBAGENT_STARTED, subagentRunId, name: "analyst" })] : []),
    ev({ type: EventType.TOOL_CALL_START, toolCallId, toolCallName: "ask_user", parentMessageId: `m-${toolCallId}`, ...tag }),
    ev({ type: EventType.TOOL_CALL_ARGS, toolCallId, delta: '{"questions":[{"question":"Which region?"}]}', ...tag }),
    ev({ type: EventType.TOOL_CALL_END, toolCallId, ...tag }),
    ...(subagentRunId
      ? [ev({ type: EventType.SUBAGENT_FINISHED, subagentRunId, outcome: { type: "suspended", interruptIds: [] } })]
      : []),
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
  return messages.flatMap((message) => (message.role === "tool" ? [[message.toolCallId, message.content]] : []));
}

function setup(scripts: Script[]) {
  const agent = new ScriptedAgent(scripts);
  let waiting = 0;
  const core = new CopilotKitCore({
    agents__unsafe_dev_only: { lab: agent },
    tools: [
      {
        name: "ask_user",
        type: "human-in-the-loop",
        handler: (_args, context) =>
          new Promise((_resolve, reject) => {
            waiting += 1;
            context.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
          }),
      },
    ],
  });
  return { agent, core, waiting: () => waiting };
}

describe("a new message while requests wait", () => {
  it("closes each open request, lets the agent take that in, then leaves the thread free for the message", async () => {
    const { agent, core, waiting } = setup([
      (input) => [started(input), ...question("q1"), ...question("q2", "sub-a"), finished(input, { type: "success", pendingToolCallIds: ["q1", "q2"] })],
    ]);
    agent.addMessage({ id: "u1", role: "user", content: "Revenue?" });
    const first = core.runAgent({ agent });
    await until(() => waiting() === 1, "the first request");

    await skipOpenRequests(core, agent);
    await first;

    expect(agent.inputs).toHaveLength(2);
    expect(toolResults(agent.inputs[1].messages)).toEqual([
      ["q1", MOVED_ON_ANSWER],
      ["q2", MOVED_ON_ANSWER],
    ]);
    expect(agent.isRunning).toBe(false);
  });

  it("sends an answer the person already gave instead of skipping it", async () => {
    const { agent, core, waiting } = setup([
      (input) => [started(input), ...question("q1"), ...question("q2", "sub-a"), finished(input, { type: "success", pendingToolCallIds: ["q1", "q2"] })],
    ]);
    agent.addMessage({ id: "u1", role: "user", content: "Revenue?" });
    void core.runAgent({ agent });
    await until(() => waiting() === 1, "the first request");

    saveAnswer("q2", '{"Which region?":"APAC"}');
    await skipOpenRequests(core, agent);

    expect(toolResults(agent.inputs[1].messages)).toEqual([
      ["q1", MOVED_ON_ANSWER],
      ["q2", '{"Which region?":"APAC"}'],
    ]);
  });

  it("does nothing when no request is open", async () => {
    const { agent, core } = setup([]);
    agent.addMessage({ id: "u1", role: "user", content: "Hi" });
    await core.runAgent({ agent });
    await skipOpenRequests(core, agent);
    expect(agent.inputs).toHaveLength(1);
  });
});
