import type { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

type CopilotKitCore = ReturnType<typeof useCopilotKit>["copilotkit"];
type Agent = ReturnType<typeof useAgent>["agent"];
type Message = Agent["messages"][number];

/** The answer a request gets when the person presses Skip. */
export const SKIPPED_ANSWER = "Skipped: the person chose not to answer.";

/** The answer an open request gets when the person sends a new message instead. */
export const MOVED_ON_ANSWER =
  "Skipped: the person sent a new message instead of answering. End your turn now " +
  "without calling tools; their message comes next.";

const savedAnswers = new Map<string, string>();

/**
 * Keep an answer CopilotKit cannot take yet: it runs requests one at a time,
 * and may reach this one after the person has answered it.
 */
export function saveAnswer(toolCallId: string, answer: string): void {
  savedAnswers.set(toolCallId, answer);
}

/** Take a kept answer, if the person gave one. */
export function takeSavedAnswer(toolCallId: string): string | undefined {
  const answer = savedAnswers.get(toolCallId);
  savedAnswers.delete(toolCallId);
  return answer;
}

export function currentRequest(messages: Message[], isRequestTool: (name: string) => boolean): string | undefined {
  return openRequestCalls(messages, isRequestTool).find((toolCallId) => !savedAnswers.has(toolCallId));
}

/**
 * The calls to the given tools that have no result yet, including those
 * sub-agents made.
 */
export function openRequestCalls(messages: Message[], isRequestTool: (name: string) => boolean): string[] {
  const answered = new Set(
    messages.flatMap((message) => (message.role === "tool" ? [message.toolCallId] : [])),
  );
  return messages.flatMap((message) =>
    message.role === "assistant"
      ? (message.toolCalls ?? [])
          .filter((call) => isRequestTool(call.function.name) && !answered.has(call.id))
          .map((call) => call.id)
      : [],
  );
}

/** Whether a tool is a request the person answers: a human-in-the-loop tool. */
export function requestToolTest(copilotkit: CopilotKitCore, agentId: string | undefined) {
  return (name: string) =>
    copilotkit.getTool({ toolName: name, ...(agentId ? { agentId } : {}) })?.type === "human-in-the-loop";
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/**
 * Close every open request before a new message. Each open browser request
 * gets the answer the person already gave it, or {@link MOVED_ON_ANSWER}, in
 * place of the result CopilotKit records for a stopped request; each open
 * approval is cancelled, which the agent reads as skipped. The agent runs once
 * to take them in: it cannot take a new message while it waits on a request,
 * so the message follows as its own run.
 */
export async function skipOpenRequests(copilotkit: CopilotKitCore, agent: Agent): Promise<void> {
  const open = openRequestCalls(agent.messages, requestToolTest(copilotkit, agent.agentId));
  const resume = (agent.pendingInterrupts ?? []).map((interrupt) => ({
    interruptId: interrupt.id,
    status: "cancelled" as const,
  }));
  if (open.length === 0 && resume.length === 0) return;
  if (open.length > 0) {
    copilotkit.stopAgent({ agent });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const answers = new Map(open.map((toolCallId) => [toolCallId, takeSavedAnswer(toolCallId) ?? MOVED_ON_ANSWER]));
    const messages = agent.messages.map((message) => {
      if (message.role !== "tool") return message;
      const answer = answers.get(message.toolCallId);
      if (answer === undefined) return message;
      answers.delete(message.toolCallId);
      return { ...message, content: answer };
    });
    for (const [toolCallId, content] of answers) {
      messages.push({ id: newId(), role: "tool", toolCallId, content });
    }
    agent.setMessages(messages);
  }
  await copilotkit.runAgent({ agent, ...(resume.length > 0 ? { resume } : {}) });
}
