import type { FormQuestion } from "../types";

export interface AskUserParams {
  question?: string;
  options?: string[];
  input_type?: FormQuestion["type"];
  questions?: Array<{ question?: string; type?: FormQuestion["type"]; options?: string[] }>;
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
    return params.questions.map((q) => ({
      question: q.question ?? "",
      type: q.type ?? (q.options ? "radio" : "text"),
      options: q.options,
    }));
  }
  if (typeof params.question === "string") {
    return [
      {
        question: params.question,
        type: params.input_type ?? (params.options ? "radio" : "text"),
        options: params.options,
      },
    ];
  }
  return [];
}

/**
 * Parse the `ask_user` tool result into a `{question: answer}` map. The result
 * is the JSON the tool emitted (see `ask_user._format_answer`); we tolerate up
 * to one extra layer of string encoding. Non-answers (empty, or the plain-text
 * "no answer"/"declined" notes) yield `null` so no card is rendered.
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
