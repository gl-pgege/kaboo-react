import { describe, it, expect } from "vitest";
import { buildAnswerPayload, normalizeQuestions, toFormQuestion } from "./askUser";

describe("toFormQuestion", () => {
  it("gives a free-text question no options", () => {
    expect(toFormQuestion({ question: "Anything else?" })).toEqual({
      question: "Anything else?",
      options: [],
      multiple: false,
    });
  });
});

describe("normalizeQuestions", () => {
  it("reads the single-question and several-question tool inputs", () => {
    expect(normalizeQuestions({ question: "Which?", options: ["a", "b"], multiple: true })).toEqual([
      { question: "Which?", options: ["a", "b"], multiple: true },
    ]);
    expect(
      normalizeQuestions({ questions: [{ question: "One?", options: ["a", "b"] }, { question: "Two?", multiple: true, options: ["c", "d"] }] }).map((q) => q.multiple),
    ).toEqual([false, true]);
  });
});

describe("buildAnswerPayload", () => {
  it("keys answers by question, with a list for multi-select and an empty answer when missing", () => {
    expect(
      buildAnswerPayload(
        [
          { question: "Which market?", options: ["AI", "Cloud"] },
          { question: "Which sectors?", options: ["B2B", "B2C"], multiple: true },
          { question: "Which region?", options: ["EU", "US"] },
        ],
        { 0: "Robotics", 1: ["B2B"] },
      ),
    ).toEqual({ "Which market?": "Robotics", "Which sectors?": ["B2B"], "Which region?": "" });
  });
});
