import type { FormQuestion } from "../types";

/** The `ask_user` tool's input: a list of questions, or a single one. */
export interface AskUserParams {
  question?: string;
  options?: string[];
  multiple?: boolean;
  questions?: Array<{
    question?: string;
    options?: string[];
    multiple?: boolean;
  }>;
}

/**
 * Read one question as the card renders it. Missing options become an empty
 * list, a free-text question answered through Other alone.
 *
 * @example
 * ```ts
 * import { toFormQuestion } from "@pgege/kaboo-react";
 *
 * toFormQuestion({ question: "Which sectors?", options: ["B2B", "B2C"], multiple: true });
 * // { question: "Which sectors?", options: ["B2B", "B2C"], multiple: true }
 * ```
 */
export function toFormQuestion(raw: { question?: string; options?: string[]; multiple?: boolean }): FormQuestion {
  return {
    question: raw.question ?? "",
    options: Array.isArray(raw.options) ? raw.options.map(String) : [],
    multiple: raw.multiple === true,
  };
}

/**
 * Normalise `ask_user` tool input (multi-question `questions` array or a single
 * `question`) into a flat {@link FormQuestion} list. Shared by the top-level
 * renderer and the nested-timeline renderer so an `ask_user` looks identical at
 * every depth.
 */
export function normalizeQuestions(params: AskUserParams | undefined): FormQuestion[] {
  if (!params) return [];
  if (Array.isArray(params.questions)) {
    return params.questions.map(toFormQuestion);
  }
  if (typeof params.question === "string") {
    return [toFormQuestion({ question: params.question, options: params.options, multiple: params.multiple })];
  }
  return [];
}

/**
 * Build the answer a question card sends back: a `{question: answer}` map,
 * with a list for a multi-select question and the person's own words for
 * Other. It is the single representation the model reads (as JSON) and the
 * answered Q&A card parses, keyed by question text so neither needs extra
 * correlation state. Custom question cards use it to send the same answer.
 *
 * @param questions - The questions, in order.
 * @param answers - The answers, by question index.
 * @returns The payload for `onResolve`.
 *
 * @example
 * ```ts
 * import { buildAnswerPayload } from "@pgege/kaboo-react";
 *
 * buildAnswerPayload(
 *   [{ question: "Which market?", options: ["AI", "Cloud"] }],
 *   { 0: "Robotics" },
 * );
 * // { "Which market?": "Robotics" }
 * ```
 */
export function buildAnswerPayload(
  questions: FormQuestion[],
  answers: Record<number, string | string[] | undefined>,
): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  questions.forEach((q, idx) => {
    out[q.question] = answers[idx] ?? (q.multiple ? [] : "");
  });
  return out;
}

/**
 * Parse the `ask_user` tool result into a `{question: answer}` map. The result
 * is the JSON the tool emitted (see `ask_user._format_answer`); we tolerate up
 * to one extra layer of string encoding. Non-answers (empty, or the plain-text
 * "no answer"/"skipped" notes) yield `null` so no card is rendered.
 */
export function parseAnswers(result: unknown): Record<string, unknown> | null {
  let value: unknown = result;
  for (let i = 0; i < 2 && typeof value === "string"; i++) {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    try {
      value = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return Object.keys(obj).length > 0 ? obj : null;
  }
  return null;
}
