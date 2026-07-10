import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import type { TimelineEntry, ToolCall } from "../types";
import { Timeline } from "./Timeline";
import {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
} from "../context/InterruptBridge";

describe("Timeline ask_user rendering", () => {
  it("renders a nested ask_user as a durable Q&A summary (question + answer)", () => {
    const askTool: ToolCall = {
      toolUseId: "a1",
      toolName: "ask_user",
      status: "success",
      toolInput: {
        questions: [
          { question: "Which segment?", type: "radio", options: ["GPUs", "APIs"] },
          { question: "Which aspects?", type: "checkbox", options: ["Pricing", "Risks"] },
        ],
      },
      toolResult: JSON.stringify({ "Which segment?": "GPUs", "Which aspects?": ["Pricing", "Risks"] }),
    };
    const timeline: TimelineEntry[] = [{ type: "tool", tool: askTool }];

    render(<Timeline timeline={timeline} active={false} />);

    expect(screen.getByText("Which segment?")).toBeInTheDocument();
    expect(screen.getByText("GPUs")).toBeInTheDocument();
    expect(screen.getByText("Which aspects?")).toBeInTheDocument();
    expect(screen.getByText("Pricing, Risks")).toBeInTheDocument();
  });

  it("renders nothing for a still-pending ask_user (no answer yet)", () => {
    const askTool: ToolCall = {
      toolUseId: "a2",
      toolName: "ask_user",
      status: "running",
      toolInput: { questions: [{ question: "Which segment?", type: "radio", options: ["GPUs"] }] },
    };
    const { container } = render(
      <Timeline timeline={[{ type: "tool", tool: askTool }]} active={true} />,
    );

    expect(screen.queryByText("Which segment?")).toBeNull();
    expect(container.querySelector(".kaboo-askuser")).toBeNull();
  });

  it("renders the live form inline when an active interrupt matches the pending tool", () => {
    const askTool: ToolCall = {
      toolUseId: "a3",
      toolName: "ask_user",
      status: "running",
      toolInput: { question: "Which segment?", input_type: "radio", options: ["GPUs", "APIs"] },
    };

    render(
      <InterruptBridgeProvider>
        <InterruptBridgePublisher
          interrupts={[
            {
              id: "i-a3",
              reason: {
                type: "form",
                questions: [
                  { question: "Which segment?", type: "radio", options: ["GPUs", "APIs"] },
                ],
              },
              toolCallId: "a3",
              onResolve: () => {},
              onCancel: () => {},
            },
          ]}
        />
        <Timeline timeline={[{ type: "tool", tool: askTool }]} active={true} />
      </InterruptBridgeProvider>,
    );

    // The interactive prompt (question + Submit) is drawn at the tool position.
    expect(screen.getByText("Which segment?")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("does not render a live form for a pending tool a different interrupt owns", () => {
    const askTool: ToolCall = {
      toolUseId: "a4",
      toolName: "ask_user",
      status: "running",
      toolInput: { question: "Which segment?", input_type: "radio", options: ["GPUs"] },
    };

    render(
      <InterruptBridgeProvider>
        <InterruptBridgePublisher
          interrupts={[
            {
              id: "i-diff",
              reason: { type: "form", questions: [{ question: "Other?", type: "text" }] },
              toolCallId: "different",
              onResolve: () => {},
              onCancel: () => {},
            },
          ]}
        />
        <Timeline timeline={[{ type: "tool", tool: askTool }]} active={true} />
      </InterruptBridgeProvider>,
    );

    expect(screen.queryByText("Which segment?")).toBeNull();
    expect(screen.queryByText("Submit")).toBeNull();
  });

  it("still renders a plain tool as a tool row", () => {
    const tool: ToolCall = {
      toolUseId: "t1",
      toolName: "research_search_web",
      toolLabel: "Searching the web",
      status: "success",
      toolResult: "results",
    };
    render(<Timeline timeline={[{ type: "tool", tool }]} active={false} />);

    expect(screen.getByText(/Searching the web|research_search_web/)).toBeInTheDocument();
  });

  it("renders a declined ask_user in order as a 'Declined by user' Q&A", () => {
    const askTool: ToolCall = {
      toolUseId: "a5",
      toolName: "ask_user",
      status: "success",
      toolInput: { question: "Which segment?", input_type: "radio", options: ["GPUs"] },
      toolResult: "The user declined to answer.",
    };
    render(<Timeline timeline={[{ type: "tool", tool: askTool }]} active={false} />);

    expect(screen.getByText("Which segment?")).toBeInTheDocument();
    expect(screen.getByText("Declined by user")).toBeInTheDocument();
  });
});

describe("Timeline parallel approval rendering", () => {
  it("renders an approval prompt inline under each gated tool row and resolves each by id", () => {
    const searchTool: ToolCall = {
      toolUseId: "tc-search",
      toolName: "research_search_web",
      toolLabel: "research_search_web",
      status: "running",
      toolInput: { query: "cloud gpu" },
    };
    const priceTool: ToolCall = {
      toolUseId: "tc-price",
      toolName: "research_fetch_pricing",
      toolLabel: "research_fetch_pricing",
      status: "running",
      toolInput: { segment: "cloud gpu" },
    };
    const resolved: string[] = [];

    render(
      <InterruptBridgeProvider>
        <InterruptBridgePublisher
          interrupts={[
            {
              id: "i-search",
              reason: {
                type: "approval",
                message: "Agent wants to call research_search_web",
                tool_name: "research_search_web",
              },
              toolCallId: "tc-search",
              onResolve: () => resolved.push("search"),
              onCancel: () => {},
            },
            {
              id: "i-price",
              reason: {
                type: "approval",
                message: "Agent wants to call research_fetch_pricing",
                tool_name: "research_fetch_pricing",
              },
              toolCallId: "tc-price",
              onResolve: () => resolved.push("price"),
              onCancel: () => {},
            },
          ]}
        />
        <Timeline
          timeline={[
            { type: "tool", tool: searchTool },
            { type: "tool", tool: priceTool },
          ]}
          active={true}
        />
      </InterruptBridgeProvider>,
    );

    // Two independent Approve buttons — one per gated tool row.
    const approveButtons = screen.getAllByText("Approve");
    expect(approveButtons).toHaveLength(2);
    expect(
      screen.getByText("Agent wants to call research_search_web"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Agent wants to call research_fetch_pricing"),
    ).toBeInTheDocument();

    // Approving the first leaves the second still open and pending.
    act(() => {
      approveButtons[0].click();
    });
    expect(resolved).toEqual(["search"]);
    expect(screen.getAllByText("Approve")).toHaveLength(1);
  });
});

describe("Timeline cancelled tool rendering", () => {
  it("marks a rejected gated tool as cancelled, not done", () => {
    const tool: ToolCall = {
      toolUseId: "t2",
      toolName: "research_search_web",
      toolLabel: "Searching the web",
      status: "success",
      toolResult: "User rejected this action.",
    };
    const { container } = render(<Timeline timeline={[{ type: "tool", tool }]} active={false} />);

    expect(screen.getByText("cancelled")).toBeInTheDocument();
    expect(screen.queryByText("done")).toBeNull();
    expect(container.querySelector(".kaboo-tool-dot-cancelled")).not.toBeNull();
  });
});
