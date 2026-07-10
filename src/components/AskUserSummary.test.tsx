import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AskUserSummary } from "./AskUserSummary";
import type { FormQuestion } from "../types";

describe("AskUserSummary", () => {
  it("renders a single question with its text answer", () => {
    const questions: FormQuestion[] = [{ question: "Which market?", type: "text" }];
    render(<AskUserSummary questions={questions} answers={{ "Which market?": "LLM APIs" }} />);
    expect(screen.getByText("Which market?")).toBeInTheDocument();
    expect(screen.getByText("LLM APIs")).toBeInTheDocument();
  });

  it("joins multi-select (array) answers", () => {
    const questions: FormQuestion[] = [
      { question: "Focus areas?", type: "checkbox", options: ["Pricing", "Risks"] },
    ];
    render(<AskUserSummary questions={questions} answers={{ "Focus areas?": ["Pricing", "Risks"] }} />);
    expect(screen.getByText("Pricing, Risks")).toBeInTheDocument();
  });

  it("renders each question in a multi-question form with its own answer", () => {
    const questions: FormQuestion[] = [
      { question: "Segment?", type: "text" },
      { question: "Aspects?", type: "checkbox", options: ["A", "B"] },
    ];
    render(
      <AskUserSummary
        questions={questions}
        answers={{ "Segment?": "Cloud GPUs", "Aspects?": ["A", "B"] }}
      />,
    );
    expect(screen.getByText("Segment?")).toBeInTheDocument();
    expect(screen.getByText("Cloud GPUs")).toBeInTheDocument();
    expect(screen.getByText("Aspects?")).toBeInTheDocument();
    expect(screen.getByText("A, B")).toBeInTheDocument();
  });

  it("shows a placeholder when an answer is missing", () => {
    const questions: FormQuestion[] = [{ question: "Anything else?", type: "text" }];
    render(<AskUserSummary questions={questions} answers={{}} />);
    expect(screen.getByText("No answer")).toBeInTheDocument();
  });
});
