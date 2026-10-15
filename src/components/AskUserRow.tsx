import type { ToolCall } from "../types";
import { AskUserSummary } from "./AskUserSummary";
import { useInterruptFor } from "../context/InterruptBridge";
import { InterruptPrompt } from "./InterruptPrompt";
import { normalizeQuestions, parseAnswers, type AskUserParams } from "../formatters/askUser";
import { isCancelledResult } from "../formatters/output";

/**
 * Renders an `ask_user` tool call in one place at its chronological tool
 * position — the live interactive form while it's pending, then the durable Q&A
 * summary once answered. Both look identical at every depth (the chat, a
 * top-level card or a nested drill), so the human-in-the-loop prompt never
 * floats out of order in a separate slot. The live form is claimed by matching
 * an open interrupt's `toolCallId` to this tool; if none matches (already
 * answered, or a different agent's prompt) nothing interactive is drawn here.
 */
export function AskUserRow({ tool }: { tool: ToolCall }) {
  const interrupt = useInterruptFor(tool.toolUseId);
  const questions = normalizeQuestions(tool.toolInput as AskUserParams | undefined);
  const answers = parseAnswers(tool.toolResult);

  if (answers) {
    if (questions.length === 0) return null;
    return <AskUserSummary questions={questions} answers={answers} />;
  }

  if (interrupt && interrupt.reason.type === "form") {
    return <InterruptPrompt interrupt={interrupt} />;
  }

  // Resolved without answers (the user dismissed the prompt): keep it visible in
  // order as a declined Q&A rather than silently dropping it.
  if (questions.length > 0 && isCancelledResult(tool.toolResult)) {
    return <AskUserSummary questions={questions} answers={{}} declined />;
  }

  return null;
}
