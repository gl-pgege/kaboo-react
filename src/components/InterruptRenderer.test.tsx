import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { InterruptRenderer } from "./InterruptRenderer";
import { InterruptRenderersProvider } from "../context/InterruptRenderers";
import type { ApprovalReason, ApprovalScope, FormQuestion, FormReason } from "../types";

function approval(extra: Partial<ApprovalReason> = {}): ApprovalReason {
  return {
    type: "approval",
    message: "Agent wants to call submit_report",
    tool_name: "submit_report",
    tool_input: { title: "Q3" },
    ...extra,
  };
}

function form(questions: Array<Partial<FormQuestion> & { question: string }>): FormReason {
  return { type: "form", questions: questions as FormQuestion[] };
}

function renderCard(
  reason: ApprovalReason | FormReason | { type: string; message?: string },
  { scopes }: { scopes?: ApprovalScope[] } = {},
) {
  const onResolve = vi.fn();
  const onCancel = vi.fn();
  const wrap = (node: ReactNode) =>
    scopes ? <InterruptRenderersProvider approvalScopes={scopes}>{node}</InterruptRenderersProvider> : node;
  render(wrap(<InterruptRenderer reason={reason} onResolve={onResolve} onCancel={onCancel} />));
  return { onResolve, onCancel };
}

describe("approval card", () => {
  it("offers approve once and deny when the request offers nothing wider", () => {
    renderCard(approval());
    expect(screen.getByText("Approve")).toBeTruthy();
    expect(screen.getByText("Deny")).toBeTruthy();
    expect(screen.queryByText("Allow for this chat")).toBeNull();
    expect(screen.queryByText("Always allow")).toBeNull();
  });

  it("approves with the scope the person chooses", () => {
    const { onResolve } = renderCard(approval({ scopes: ["once", "thread", "always"] }));
    fireEvent.click(screen.getByText("Always allow"));
    expect(onResolve).toHaveBeenCalledWith({ status: "approved", scope: "always" });
  });

  it("offers only the scopes both the agent and the app allow", () => {
    renderCard(approval({ scopes: ["once", "thread", "always"] }), { scopes: ["once", "thread"] });
    expect(screen.getByText("Allow for this chat")).toBeTruthy();
    expect(screen.queryByText("Always allow")).toBeNull();
  });

  it("says what a wider approval covers", () => {
    const subject = { key: "store:summit/catalog", label: "catalog changes in Summit Outfitters" };
    renderCard(approval({ scopes: ["once", "thread"], subject }));
    expect(screen.getByText("Applies to catalog changes in Summit Outfitters")).toBeTruthy();
  });

  it("names no coverage when only this call can be approved", () => {
    const subject = { key: "store:summit/team", label: "team changes in Summit Outfitters" };
    renderCard(approval({ scopes: ["once", "thread"], subject }), { scopes: ["once"] });
    expect(screen.queryByText(/Applies to/)).toBeNull();
  });

  it("sends a denial with the person's reason, as a cancellation", () => {
    const { onResolve, onCancel } = renderCard(approval());
    fireEvent.click(screen.getByText("Deny"));
    fireEvent.change(screen.getByLabelText("Reason for denying"), { target: { value: "use the final title" } });
    fireEvent.click(screen.getByRole("button", { name: "Deny" }));

    expect(onResolve).toHaveBeenCalledWith({ status: "cancelled", reason: "use the final title" });
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("shows how long the request stays answerable", () => {
    const soon = new Date(Date.now() + 10 * 60_000).toISOString();
    renderCard(approval({ expiresAt: soon }));
    expect(screen.getByText(/Expires in/)).toBeTruthy();
  });

  it("offers only Dismiss once the request expired", () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const { onResolve, onCancel } = renderCard(approval({ expiresAt: past, scopes: ["once", "thread"] }));

    expect(screen.queryByText("Approve")).toBeNull();
    fireEvent.click(screen.getByText("Dismiss"));
    expect(onCancel).toHaveBeenCalled();
    expect(onResolve).not.toHaveBeenCalled();
  });
});

describe("question card", () => {
  it("sends the chosen option", () => {
    const { onResolve } = renderCard(form([{ question: "Which market?", options: ["AI", "Cloud"] }]));
    fireEvent.click(screen.getByLabelText("Cloud"));
    fireEvent.click(screen.getByText("Submit"));
    expect(onResolve).toHaveBeenCalledWith({ "Which market?": "Cloud" });
  });

  it("lets the person answer in their own words through Other", () => {
    const { onResolve } = renderCard(form([{ question: "Which market?", options: ["AI", "Cloud"] }]));
    fireEvent.change(screen.getByLabelText("Other answer to: Which market?"), { target: { value: "Robotics" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(onResolve).toHaveBeenCalledWith({ "Which market?": "Robotics" });
  });

  it("collects several choices and Other for a multi-select question", () => {
    const { onResolve } = renderCard(
      form([{ question: "Which sectors?", options: ["B2B", "B2C", "Gov"], multiple: true }]),
    );
    fireEvent.click(screen.getByLabelText("B2B"));
    fireEvent.click(screen.getByLabelText("Gov"));
    fireEvent.change(screen.getByLabelText("Other answer to: Which sectors?"), { target: { value: "Edu" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(onResolve).toHaveBeenCalledWith({ "Which sectors?": ["B2B", "Gov", "Edu"] });
  });

  it("asks a free-text question through Other alone, with no text box", () => {
    const { onResolve } = renderCard(form([{ question: "Anything else?", options: [] }]));
    expect(document.querySelector("textarea")).toBeNull();
    fireEvent.change(screen.getByLabelText("Other answer to: Anything else?"), { target: { value: "No" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(onResolve).toHaveBeenCalledWith({ "Anything else?": "No" });
  });

  it("waits for an answer to every question before submitting", () => {
    renderCard(form([{ question: "Which market?", options: ["AI", "Cloud"] }]));
    expect((screen.getByText("Submit") as HTMLButtonElement).disabled).toBe(true);
  });

  it("steps through several questions", () => {
    const { onResolve } = renderCard(
      form([
        { question: "Which market?", options: ["AI", "Cloud"] },
        { question: "Which sectors?", options: ["B2B", "B2C"], multiple: true },
      ]),
    );
    fireEvent.click(screen.getByLabelText("AI"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByLabelText("B2C"));
    fireEvent.click(screen.getByText("Submit"));
    expect(onResolve).toHaveBeenCalledWith({ "Which market?": "AI", "Which sectors?": ["B2C"] });
  });

  it("skips the question without an answer", () => {
    const { onResolve, onCancel } = renderCard(form([{ question: "Which market?", options: ["AI", "Cloud"] }]));
    fireEvent.click(screen.getByText("Skip"));
    expect(onCancel).toHaveBeenCalled();
    expect(onResolve).not.toHaveBeenCalled();
  });
});

describe("an app's own request kind with no renderer", () => {
  it("shows its message and Skip", () => {
    const { onCancel } = renderCard({ type: "files", message: "Upload the Q3 workbook" });
    expect(screen.getByText("Upload the Q3 workbook")).toBeTruthy();
    fireEvent.click(screen.getByText("Skip"));
    expect(onCancel).toHaveBeenCalled();
  });
});
