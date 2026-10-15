import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
  type ActiveInterrupt,
} from "../context/InterruptBridge";
import type { ActivityState, StreamGroup } from "../types";

type ToolRenderProps = {
  toolCallId: string;
  parameters: unknown;
  status: "inProgress" | "executing" | "complete";
  result?: string;
};

const { captured } = vi.hoisted(() => ({
  captured: {
    render: null as null | ((p: ToolRenderProps) => ReactNode),
  },
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  useRenderTool: (opts: { render: (p: ToolRenderProps) => ReactNode }) => {
    captured.render = opts.render;
  },
}));

import { KabooAskUser } from "./KabooAskUser";

const question = { question: "Which store would you like to set up?", options: ["Harbor Goods", "test"] };

const plainAgent: Record<string, StreamGroup> = {
  merchant: {
    title: "Merchant",
    agentName: "merchant",
    parentGroup: null,
    inlineChatOwner: true,
    status: "active",
    timeline: [{ type: "tool", toolUseId: "call-1" }],
    tools: [
      {
        toolUseId: "call-1",
        toolName: "ask_user",
        toolInput: { questions: [question] },
        status: "running",
      },
    ],
  },
};

function formInterrupt(onResolve: (payload: unknown) => void = () => {}): ActiveInterrupt {
  return {
    id: "i-call-1",
    reason: {
      type: "form",
      questions: [{ question: question.question, type: "radio", options: question.options }],
    },
    toolCallId: "call-1",
    onResolve,
    onCancel: () => {},
  };
}

function RenderCaptured({ props }: { props: ToolRenderProps }) {
  return <>{captured.render?.(props)}</>;
}

function Harness({ interrupts = [], toolProps }: { interrupts?: ActiveInterrupt[]; toolProps: ToolRenderProps }) {
  const state: ActivityState = { groups: plainAgent };
  return (
    <ActivityContext.Provider value={state}>
      <InterruptBridgeProvider>
        <InterruptBridgePublisher interrupts={interrupts} />
        <KabooAskUser />
        <RenderCaptured props={toolProps} />
      </InterruptBridgeProvider>
    </ActivityContext.Provider>
  );
}

const waiting: ToolRenderProps = {
  toolCallId: "call-1",
  parameters: { questions: [question] },
  status: "executing",
};

beforeEach(() => {
  captured.render = null;
});

describe("KabooAskUser", () => {
  it("renders the live form for a plain agent's waiting question, where the chat slot defers", () => {
    const answers: unknown[] = [];
    render(<Harness interrupts={[formInterrupt((payload) => answers.push(payload))]} toolProps={waiting} />);

    expect(screen.getByText("Which store would you like to set up?")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Harbor Goods"));
    fireEvent.click(screen.getByText("Submit"));
    expect(answers).toEqual([{ "Which store would you like to set up?": "Harbor Goods" }]);
  });

  it("renders nothing interactive when no open question anchors to the call", () => {
    render(<Harness toolProps={waiting} />);
    expect(screen.queryByText("Which store would you like to set up?")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();
  });

  it("renders the question and the answer once the tool resolves", () => {
    render(
      <Harness
        toolProps={{
          ...waiting,
          status: "complete",
          result: JSON.stringify({ "Which store would you like to set up?": "Harbor Goods" }),
        }}
      />,
    );
    expect(screen.getByText("Which store would you like to set up?")).toBeInTheDocument();
    expect(screen.getByText("Harbor Goods")).toBeInTheDocument();
    expect(screen.queryByText("Submit")).toBeNull();
  });

  it("keeps a question skipped by a new message in order as Skipped", () => {
    render(
      <Harness
        toolProps={{
          ...waiting,
          status: "complete",
          result: "Skipped: the person sent a message instead of answering.",
        }}
      />,
    );
    expect(screen.getByText("Which store would you like to set up?")).toBeInTheDocument();
    expect(screen.getByText("Skipped")).toBeInTheDocument();
  });
});
