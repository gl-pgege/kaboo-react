import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CopilotKitProvider, useRenderTool } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";
import type { StreamGroup, TimelineEntry, ToolCall } from "../types";
import { Timeline } from "./Timeline";
import { ToolRenderersProvider, type ToolRendererProps } from "../context/ToolRenderers";
import { ActivityContext } from "../context/ActivityProvider";
import { useToolCallMeta } from "../context/ToolCallMeta";

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

  it("draws unregistered tools with the app's fallback renderer instead of the built-in row", () => {
    const other: ToolCall = { toolUseId: "tc-other", toolName: "list_tables", status: "success", toolResult: "[]" };
    const Card = () => <div data-testid="custom-tool-card" />;
    const Fallback = ({ tool: rendered }: ToolRendererProps) => <div data-testid="app-fallback">{rendered.toolName}</div>;
    const { container } = render(
      <ToolRenderersProvider renderers={{ create_work_item: Card }} fallbackToolRenderer={Fallback}>
        <Timeline timeline={refs(tool, other)} tools={[tool, other]} active={false} />
      </ToolRenderersProvider>,
    );

    expect(screen.getByTestId("custom-tool-card")).toBeInTheDocument();
    expect(screen.getByTestId("app-fallback").textContent).toBe("list_tables");
    expect(container.querySelector(".kaboo-tool-row")).toBeNull();
  });
});

describe("Timeline tool call meta (useToolCallMeta)", () => {
  function MetaProbe({ tool }: ToolRendererProps) {
    return <div data-testid={`meta-${tool.toolUseId}`}>{JSON.stringify(useToolCallMeta())}</div>;
  }
  const meta = (id: string) => JSON.parse(screen.getByTestId(`meta-${id}`).textContent ?? "null");

  const ok: ToolCall = {
    toolUseId: "m1",
    toolName: "lookup",
    toolLabel: "Looking up",
    status: "success",
    toolResult: "ok",
    startedAt: 1000,
    endedAt: 1450,
  };
  const failed: ToolCall = {
    toolUseId: "m2",
    toolName: "lookup",
    status: "error",
    toolResult: "boom",
    error: "Table not found",
    fix: "List the tables first",
    startedAt: 2000,
    endedAt: 2100,
  };
  const cancelled: ToolCall = { toolUseId: "m3", toolName: "lookup", status: "cancelled", startedAt: 3000, endedAt: 3500 };
  const declined: ToolCall = { toolUseId: "m4", toolName: "lookup", status: "success", toolResult: "User rejected this action." };

  it("gives a tool renderer the call's status, label, error, fix, timing and agent", () => {
    render(
      <ToolRenderersProvider renderers={{ lookup: MetaProbe }}>
        <Timeline
          timeline={refs(ok, failed, cancelled, declined)}
          tools={[ok, failed, cancelled, declined]}
          active={false}
          agentName="analyst"
        />
      </ToolRenderersProvider>,
    );

    expect(meta("m1")).toEqual({
      status: "success",
      label: "Looking up",
      startedAt: 1000,
      endedAt: 1450,
      toolCallId: "m1",
      agentName: "analyst",
    });
    expect(meta("m2")).toEqual({
      status: "error",
      error: "Table not found",
      fix: "List the tables first",
      startedAt: 2000,
      endedAt: 2100,
      toolCallId: "m2",
      agentName: "analyst",
    });
    expect(meta("m3")).toEqual({ status: "cancelled", startedAt: 3000, endedAt: 3500, toolCallId: "m3", agentName: "analyst" });
    expect(meta("m4")).toMatchObject({ status: "cancelled", toolCallId: "m4" });
  });

  it("gives the app's fallback renderer the meta too", () => {
    render(
      <ToolRenderersProvider fallbackToolRenderer={MetaProbe}>
        <Timeline timeline={refs(failed)} tools={[failed]} active={false} />
      </ToolRenderersProvider>,
    );

    expect(meta("m2")).toMatchObject({ status: "error", error: "Table not found", toolCallId: "m2" });
  });

  it("is null outside a timeline", () => {
    render(<MetaProbe tool={ok} />);

    expect(meta("m1")).toBeNull();
  });
});

describe("Timeline read grouping (isReadOnlyTool)", () => {
  const isReadOnlyTool = (name: string) => name.startsWith("get_");
  const read = (id: string, status: ToolCall["status"] = "success"): ToolCall => ({
    toolUseId: id,
    toolName: "get_table",
    toolLabel: `Table ${id}`,
    status,
    toolResult: status === "running" ? undefined : "ok",
  });
  const write: ToolCall = { toolUseId: "w1", toolName: "update_table", toolLabel: "Updating the table", status: "success", toolResult: "ok" };
  const draw = (tools: ToolCall[]) => (
    <ToolRenderersProvider isReadOnlyTool={isReadOnlyTool}>
      <Timeline timeline={refs(...tools)} tools={tools} active={false} />
    </ToolRenderersProvider>
  );

  it("collapses consecutive reads into one row that expands to the individual rows", () => {
    const { container, rerender } = render(draw([read("r1"), read("r2", "running"), read("r3")]));

    expect(screen.getByText("Reading 3 items")).toBeInTheDocument();
    expect(screen.queryByText("Table r1")).toBeNull();
    expect(container.querySelectorAll(".kaboo-tool-group")).toHaveLength(1);

    fireEvent.click(screen.getByText("Reading 3 items"));
    expect(screen.getByText("Table r1")).toBeInTheDocument();
    expect(screen.getByText("Table r2")).toBeInTheDocument();
    expect(screen.getByText("Table r3")).toBeInTheDocument();

    rerender(draw([read("r1"), read("r2"), read("r3")]));
    expect(screen.getByText("Read 3 items")).toBeInTheDocument();

    rerender(draw([read("r1"), read("r2", "error"), read("r3")]));
    expect(screen.getByText("Read 3 items, 1 failed")).toBeInTheDocument();
  });

  it("does not group a single read, or reads split by another call", () => {
    const { container } = render(draw([read("r1"), write, read("r2")]));

    expect(container.querySelector(".kaboo-tool-group")).toBeNull();
    expect(screen.getByText("Table r1")).toBeInTheDocument();
    expect(screen.getByText("Updating the table")).toBeInTheDocument();
    expect(screen.getByText("Table r2")).toBeInTheDocument();
  });

  it("leaves every call ungrouped without isReadOnlyTool", () => {
    const tools = [read("r1"), read("r2")];
    const { container } = render(<Timeline timeline={refs(...tools)} tools={tools} active={false} />);

    expect(container.querySelector(".kaboo-tool-group")).toBeNull();
    expect(container.querySelectorAll(".kaboo-tool-row")).toHaveLength(2);
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

  it("draws a call that started a sub-agent as that agent's card", async () => {
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
    expect(container.querySelectorAll(".kaboo-tool-row")).toHaveLength(0);
    expect(container.querySelectorAll(".kaboo-agent-card")).toHaveLength(1);
    expect(screen.getByText("Analyst")).toBeInTheDocument();
  });

  it("draws an errored or cancelled call as complete, leaving the real status to useToolCallMeta", async () => {
    function SqlMeta({ status, result }: { status: string; result?: string }) {
      const meta = useToolCallMeta();
      return <div data-testid={`sql-meta-${meta?.toolCallId}`}>{`${status}|${result ?? ""}|${meta?.status}|${meta?.error ?? ""}`}</div>;
    }
    function MetaSqlRenderer() {
      useRenderTool({
        name: "run_sql",
        parameters: anyParameters,
        render: ({ status, result }) => <SqlMeta status={status} result={result} />,
      });
      return null;
    }
    const failed: ToolCall = { ...sql, toolUseId: "e1", status: "error", toolResult: undefined, error: "relation missing" };
    const cancelled: ToolCall = { ...sql, toolUseId: "c1", status: "cancelled", toolResult: undefined };
    render(
      <CopilotKitProvider>
        <MetaSqlRenderer />
        <Timeline timeline={refs(failed, cancelled)} tools={[failed, cancelled]} active={false} agentName="analyst" />
      </CopilotKitProvider>,
    );

    expect((await screen.findByTestId("sql-meta-e1")).textContent).toBe("complete|relation missing|error|relation missing");
    expect(screen.getByTestId("sql-meta-c1").textContent).toBe("complete||cancelled|");
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
