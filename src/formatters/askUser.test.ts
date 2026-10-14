import { describe, it, expect } from "vitest";
import { buildAnswerPayload, normalizeQuestions, toFormQuestion } from "./askUser";

describe("toFormQuestion", () => {
  it("prefers multiple and reads the deprecated checkbox type when it is absent", () => {
    expect(toFormQuestion({ question: "q", options: ["a", "b"], multiple: false, type: "checkbox" }).multiple).toBe(false);
    expect(toFormQuestion({ question: "q", options: ["a", "b"], type: "checkbox" }).multiple).toBe(true);
    expect(toFormQuestion({ question: "q", options: ["a", "b"], type: "radio" }).multiple).toBe(false);
  });

  it("gives an older free-text question no options", () => {
    expect(toFormQuestion({ question: "Anything else?", type: "text" })).toEqual({
      question: "Anything else?",
      options: [],
      multiple: false,
    });
  });
});

describe("normalizeQuestions", () => {
  it("reads the single-question and several-question tool inputs, current and older", () => {
    expect(normalizeQuestions({ question: "Which?", options: ["a", "b"], multiple: true })).toEqual([
      { question: "Which?", options: ["a", "b"], multiple: true },
    ]);
    expect(normalizeQuestions({ question: "Which?", options: ["a", "b"], input_type: "checkbox" })[0].multiple).toBe(true);
    expect(
      normalizeQuestions({ questions: [{ question: "One?", options: ["a", "b"] }, { question: "Two?", type: "checkbox", options: ["c", "d"] }] }).map((q) => q.multiple),
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
