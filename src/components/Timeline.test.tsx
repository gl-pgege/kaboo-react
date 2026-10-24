import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CopilotKitProvider, useRenderTool } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";
import type { StreamGroup, TimelineEntry, ToolCall } from "../types";
import { Timeline } from "./Timeline";
import { ToolRenderersProvider } from "../context/ToolRenderers";
import { ActivityContext } from "../context/ActivityProvider";

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

  it("renders a skipped ask_user in order as a 'Skipped' Q&A", () => {
    const askTool: ToolCall = {
      toolUseId: "a5",
      toolName: "ask_user",
      status: "success",
      toolInput: { question: "Which segment?", input_type: "radio", options: ["GPUs"] },
      toolResult: "The user declined to answer.",
    };
    render(<Timeline timeline={refs(askTool)} tools={[askTool]} active={false} />);

    expect(screen.getByText("Which segment?")).toBeInTheDocument();
    expect(screen.getByText("Skipped")).toBeInTheDocument();
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

});

describe("Timeline with renderers registered in CopilotKit", () => {
  const anyParameters = {
    "~standard": { version: 1 as const, vendor: "test", validate: (value: unknown) => ({ value }) },
  };

  function SqlRenderer() {
    useRenderTool({
      name: "run_sql",
      parameters: anyParameters,
      render: ({ status, parameters, result }) => (
        <div data-testid="sql-card">{`${status}|${(parameters as { sql?: string }).sql}|${result ?? ""}`}</div>
      ),
    });
    return null;
  }

  const sql: ToolCall = {
    toolUseId: "s1",
    toolName: "run_sql",
    status: "success",
    toolInput: { sql: "select 1" },
    toolResult: "one row",
  };

  const withRenderer = (children: ReactNode) => (
    <CopilotKitProvider>
      <SqlRenderer />
      {children}
    </CopilotKitProvider>
  );

  it("draws a finished call with the renderer registered for its name", async () => {
    render(withRenderer(<Timeline timeline={refs(sql)} tools={[sql]} active={false} />));
    expect((await screen.findByTestId("sql-card")).textContent).toBe("complete|select 1|one row");
  });

  it("draws a running call with the arguments streamed so far", async () => {
    const running: ToolCall = { ...sql, status: "running", toolInput: { sql: "sel" }, toolResult: undefined };
    render(withRenderer(<Timeline timeline={refs(running)} tools={[running]} active />));
    expect((await screen.findByTestId("sql-card")).textContent).toBe("inProgress|sel|");
  });

  it("keeps a call that started a sub-agent as a row", async () => {
    const delegating: ToolCall = { ...sql, toolUseId: "d1" };
    const spawned: StreamGroup = {
      title: "Analyst",
      agentName: "run_sql",
      parentGroup: null,
      toolCallId: "d1",
      status: "completed",
      tools: [],
      timeline: [],
    };
    const { container } = render(
      withRenderer(
        <ActivityContext.Provider value={{ groups: { analyst: spawned } }}>
          <Timeline timeline={refs(sql, delegating)} tools={[sql, delegating]} active={false} />
        </ActivityContext.Provider>,
      ),
    );
    await screen.findByTestId("sql-card");
    expect(screen.getAllByTestId("sql-card")).toHaveLength(1);
    expect(container.querySelectorAll(".kaboo-tool-row")).toHaveLength(1);
    expect(screen.getByText("Run sql")).toBeInTheDocument();
  });
});

describe("Timeline surface tools", () => {
  it("draws no row for render_a2ui, whose surface renders in the chat", () => {
    const render_a2ui: ToolCall = { toolUseId: "r1", toolName: "render_a2ui", status: "success", toolResult: "Rendered." };
    const { container } = render(<Timeline timeline={refs(render_a2ui)} tools={[render_a2ui]} active={false} />);
    expect(container.querySelector(".kaboo-tool-row")).toBeNull();
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
