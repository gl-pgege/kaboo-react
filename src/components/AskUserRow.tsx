import type { ToolCall } from "../types";
import { AskUserSummary } from "./AskUserSummary";
import { normalizeQuestions, parseAnswers, type AskUserParams } from "../formatters/askUser";
import { isCancelledResult } from "../formatters/output";

/**
 * An `ask_user` call inside an agent card: the questions with the person's
 * answers once they answer, or marked declined when they skip. The live form
 * is in the chat transcript, where every agent's questions come up.
 */
export function AskUserRow({ tool }: { tool: ToolCall }) {
  const questions = normalizeQuestions(tool.toolInput as AskUserParams | undefined);
  if (questions.length === 0) return null;
  const answers = parseAnswers(tool.toolResult);
  if (answers) return <AskUserSummary questions={questions} answers={answers} />;
  if (isCancelledResult(tool.toolResult)) return <AskUserSummary questions={questions} answers={{}} declined />;
  return null;
}
