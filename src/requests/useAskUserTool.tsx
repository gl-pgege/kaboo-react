import type { ReactElement } from "react";
import { AskUserSummary } from "../components/AskUserSummary";
import { InterruptRenderer } from "../components/InterruptRenderer";
import { parseAnswers, toFormQuestion } from "../formatters/askUser";
import { isCancelledResult } from "../formatters/output";
import { ASK_USER_DESCRIPTION, ASK_USER_TOOL, askUserParameters, type AskUserArgs } from "./askUser";
import { useRequestTool, type KabooRequestRenderProps } from "./useRequestTool";

/** Options for {@link useAskUserTool}. */
export interface UseAskUserToolOptions {
  /** Offer the tool to this agent only. */
  agentId?: string;
  /** What the agent reads about the tool; the default suits most agents. */
  description?: string;
  /** A panel of your own in place of {@link AskUserPanel}. */
  render?: (props: KabooRequestRenderProps<AskUserArgs>) => ReactElement | null;
}

/**
 * The question panel: a multiple-choice form with Other on every question
 * while the question waits, then the questions with the person's answers.
 */
export function AskUserPanel({
  args,
  status,
  result,
  answer,
  skip,
}: KabooRequestRenderProps<AskUserArgs>): ReactElement | null {
  const questions = args.questions.map(toFormQuestion);
  if (status === "waiting") {
    return <InterruptRenderer reason={{ type: "form", questions }} onResolve={answer} onCancel={skip} />;
  }
  const answers = parseAnswers(result);
  if (answers) return <AskUserSummary questions={questions} answers={answers} />;
  if (isCancelledResult(result)) return <AskUserSummary questions={questions} answers={{}} declined />;
  return null;
}

/**
 * Register `ask_user`, the question tool: an agent whose `client_tools` allow
 * it asks the person short questions and waits for the answers, which come
 * back as JSON keyed by question.
 *
 * @example
 * ```tsx
 * import { useAskUserTool } from "@pgege/kaboo-react";
 * import { KabooChat } from "@pgege/kaboo-react/copilotkit";
 *
 * function Chat() {
 *   useAskUserTool();
 *   return <KabooChat />;
 * }
 * ```
 */
export function useAskUserTool(options: UseAskUserToolOptions = {}): void {
  useRequestTool({
    name: ASK_USER_TOOL,
    description: options.description ?? ASK_USER_DESCRIPTION,
    parameters: askUserParameters,
    render: options.render ?? AskUserPanel,
    ...(options.agentId ? { agentId: options.agentId } : {}),
  });
}
