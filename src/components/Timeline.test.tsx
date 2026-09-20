import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import type { TimelineEntry, ToolCall } from "../types";
import { Timeline } from "./Timeline";
import {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
} from "../context/InterruptBridge";
import { InterruptRenderersProvider } from "../context/InterruptRenderers";
import { ToolRenderersProvider } from "../context/ToolRenderers";
import type { InterruptRendererProps } from "../types";

/**
 * Timeline entries as the producer emits them: a reference per tool, with the
 * call itself living once in the group's `tools`.
 */
const refs = (...tools: ToolCall[]): TimelineEntry[] =>
  tools.map((t) => ({ type: "tool", toolUseId: t.toolUseId }));

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
    render(<Timeline timeline={refs(askTool)} tools={[askTool]} active={false} />);

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
      <Timeline timeline={refs(askTool)} tools={[askTool]} active={true} />,
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
        <Timeline timeline={refs(askTool)} tools={[askTool]} active={true} />
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
        <Timeline timeline={refs(askTool)} tools={[askTool]} active={true} />
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
    render(<Timeline timeline={refs(tool)} tools={[tool]} active={false} />);

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
    render(<Timeline timeline={refs(askTool)} tools={[askTool]} active={false} />);

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
          timeline={refs(searchTool, priceTool)}
          tools={[searchTool, priceTool]}
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

describe("Timeline custom interrupt renderer", () => {
  it("renders the anchored approval gate with the app's interruptRenderers override", () => {
    const tool: ToolCall = {
      toolUseId: "tc-gated",
      toolName: "create_work_item",
      status: "running",
      toolInput: { title: "T" },
    };
    const Custom = ({ reason }: InterruptRendererProps) => (
      <div data-testid="custom-approval">
        {reason.type === "approval" ? reason.message : ""}
      </div>
    );

    render(
      <InterruptBridgeProvider>
        <InterruptRenderersProvider renderers={{ approval: Custom }}>
          <InterruptBridgePublisher
            interrupts={[
              {
                id: "i-gated",
                reason: {
                  type: "approval",
                  message: "Agent wants to call create_work_item",
                  tool_name: "create_work_item",
                },
                toolCallId: "tc-gated",
                onResolve: () => {},
                onCancel: () => {},
              },
            ]}
          />
          <Timeline timeline={refs(tool)} tools={[tool]} active={true} />
        </InterruptRenderersProvider>
      </InterruptBridgeProvider>,
    );

    expect(screen.getByTestId("custom-approval").textContent).toBe(
      "Agent wants to call create_work_item",
    );
    expect(screen.queryByText("Approve")).toBeNull();
  });
});

describe("Timeline per-tool-name renderers (toolRenderers)", () => {
  const tool: ToolCall = {
    toolUseId: "tc-create",
    toolName: "create_work_item",
    toolLabel: "Create work item",
    status: "success",
    toolInput: { body: { title: "T" } },
    toolResult: JSON.stringify({ status: "pending_approval", proposalId: "p1" }),
  };

  it("replaces the built-in tool row with the registered card", () => {
    const Card = ({ tool: rendered }: import("../context/ToolRenderers").ToolRendererProps) => (
      <div data-testid="custom-tool-card">{rendered.toolUseId}</div>
    );
    const { container } = render(
      <ToolRenderersProvider renderers={{ create_work_item: Card }}>
        <Timeline timeline={refs(tool)} tools={[tool]} active={false} />
      </ToolRenderersProvider>,
    );

    expect(screen.getByTestId("custom-tool-card").textContent).toBe("tc-create");
    expect(container.querySelector(".kaboo-tool-row")).toBeNull();
  });

  it("falls back to the built-in row for unregistered tools", () => {
    render(
      <ToolRenderersProvider renderers={{ other_tool: () => <div /> }}>
        <Timeline timeline={refs(tool)} tools={[tool]} active={false} />
      </ToolRenderersProvider>,
    );

    expect(screen.getByText(/Create work item/)).toBeInTheDocument();
  });

  it("still renders the anchored approval gate under a custom card", () => {
    const Card = () => <div data-testid="custom-tool-card" />;
    render(
      <InterruptBridgeProvider>
        <ToolRenderersProvider renderers={{ create_work_item: Card }}>
          <InterruptBridgePublisher
            interrupts={[
              {
                id: "i-c",
                reason: {
                  type: "approval",
                  message: "Approve create_work_item",
                  tool_name: "create_work_item",
                },
                toolCallId: "tc-create",
                onResolve: () => {},
                onCancel: () => {},
              },
            ]}
          />
          <Timeline timeline={refs(tool)} tools={[tool]} active={true} />
        </ToolRenderersProvider>
      </InterruptBridgeProvider>,
    );

    expect(screen.getByTestId("custom-tool-card")).toBeInTheDocument();
    expect(screen.getByText("Approve")).toBeInTheDocument();
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
    const { container } = render(
      <Timeline timeline={refs(tool)} tools={[tool]} active={false} />,
    );

    expect(screen.getByText("cancelled")).toBeInTheDocument();
    expect(screen.queryByText("done")).toBeNull();
    expect(container.querySelector(".kaboo-tool-dot-cancelled")).not.toBeNull();
  });
});

describe("Timeline tool entry shapes", () => {
  const tool: ToolCall = {
    toolUseId: "t9",
    toolName: "research_search_web",
    toolLabel: "Searching the web",
    status: "done",
    toolResult: "ok",
  };

  it("resolves a reference entry against the group's tools", () => {
    render(
      <Timeline timeline={[{ type: "tool", toolUseId: "t9" }]} tools={[tool]} active={false} />,
    );

    expect(screen.getByText(/Searching the web/)).toBeInTheDocument();
  });

  it("still renders a tool embedded in the entry", () => {
    // Snapshots written before the reference form inlined the call, and threads
    // persisted then still replay.
    render(<Timeline timeline={[{ type: "tool", tool }]} tools={[]} active={false} />);

    expect(screen.getByText(/Searching the web/)).toBeInTheDocument();
  });

  it("renders nothing for a reference with no matching tool", () => {
    const { container } = render(
      <Timeline timeline={[{ type: "tool", toolUseId: "missing" }]} tools={[tool]} active={false} />,
    );

    expect(container.querySelector(".kaboo-tool-row")).toBeNull();
    expect(screen.queryByText(/Searching the web/)).toBeNull();
  });

  it("keeps text and tool entries in their original order", () => {
    const { container } = render(
      <Timeline
        timeline={[
          { type: "text", text: "before" },
          { type: "tool", toolUseId: "t9" },
          { type: "text", text: "after" },
        ]}
        tools={[tool]}
        active={false}
      />,
    );

    const text = container.textContent ?? "";
    expect(text.indexOf("before")).toBeLessThan(text.indexOf("Searching the web"));
    expect(text.indexOf("Searching the web")).toBeLessThan(text.indexOf("after"));
  });
});
