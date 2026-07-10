import { useRenderTool } from "@copilotkit/react-core/v2";
import { AskUserSummary } from "../components/AskUserSummary";
import { normalizeQuestions, parseAnswers, type AskUserParams } from "../formatters/askUser";
import type { FormQuestion } from "../types";

/**
 * Permissive Standard Schema. `useRenderTool` requires a `parameters` schema but
 * never validates against it at render time (it parses the raw tool args). This
 * shim satisfies the type without pulling in a schema library.
 */
const ANY_PARAMETERS = {
  "~standard": {
    version: 1 as const,
    vendor: "kaboo",
    validate: (value: unknown) => ({ value }),
  },
};

/**
 * Renders answered `ask_user` prompts inline in the chat, anchored to the tool
 * call. The tool call is a permanent part of the transcript, so the question and
 * the user's answer persist in chronological order after the interrupt resolves.
 *
 * While the prompt is still pending (no result yet), this renders nothing — the
 * live interactive form is supplied by {@link KabooInterruptHandler}'s
 * `useInterrupt` render.
 */
export function KabooAskUser({ agentId }: { agentId?: string }) {
  useRenderTool({
    name: "ask_user",
    ...(agentId ? { agentId } : {}),
    parameters: ANY_PARAMETERS,
    render: ({ parameters, result }) => {
      const questions = normalizeQuestions(parameters as AskUserParams | undefined);
      if (questions.length === 0) return <></>;

      return <AskUserCard questions={questions} result={result} />;
    },
  });

  return null;
}

/**
 * Renders the answered Q&A once the tool result carries answers. While the
 * prompt is still pending the result is empty, so nothing is drawn here and the
 * live interactive form (from `useInterrupt`) owns the UI. The tool result is
 * the single source of truth, so the card also survives a reload/replay.
 */
function AskUserCard({
  questions,
  result,
}: {
  questions: FormQuestion[];
  result: unknown;
}) {
  const answers = parseAnswers(result);
  if (!answers) return <></>;
  return <AskUserSummary questions={questions} answers={answers} />;
}
