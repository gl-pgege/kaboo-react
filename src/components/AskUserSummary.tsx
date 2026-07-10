import type { ReactElement } from "react";
import type { FormQuestion } from "../types";

function formatAnswer(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map((v) => String(v)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Read-only, durable record of an answered `ask_user` prompt. Rendered from the
 * tool call that lives permanently in the transcript, so the question(s) and the
 * user's answer stay visible inline (in chat order) after the interrupt resolves.
 */
export function AskUserSummary({
  questions,
  answers,
  declined = false,
}: {
  questions: FormQuestion[];
  answers: Record<string, unknown>;
  /** Render as a declined prompt: no answers were given (the user dismissed it). */
  declined?: boolean;
}): ReactElement {
  return (
    <div className="kaboo-askuser">
      {questions.map((q, idx) => {
        const answer = answers[q.question];
        const hasAnswer = answer != null && formatAnswer(answer) !== "";
        return (
          <div key={idx} className="kaboo-askuser-qa">
            <div className="kaboo-askuser-question">{q.question}</div>
            <div
              className={`kaboo-askuser-answer ${hasAnswer ? "" : declined ? "kaboo-askuser-answer-declined" : "kaboo-askuser-answer-empty"}`}
            >
              {hasAnswer ? formatAnswer(answer) : declined ? "Declined by user" : "No answer"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
