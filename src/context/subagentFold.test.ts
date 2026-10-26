import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { from, lastValueFrom, toArray } from "rxjs";
import { compactEvents, verifyEvents, type BaseEvent } from "@ag-ui/client";
import type { ActivityState } from "../types";
import { foldSubagentEvent, newFoldMemory, parsePartialJson, type SubagentEvent } from "./subagentFold";

const recorded = (name: string): Record<string, unknown>[] =>
  readFileSync(join(process.cwd(), "src/__fixtures__", `${name}.jsonl`), "utf8")
    .trim()
    .split("\n")
    .map((line) => {
      const { at: _at, ...event } = JSON.parse(line) as Record<string, unknown>;
      return event;
    });

function fold(events: Record<string, unknown>[]): ActivityState {
  const memory = newFoldMemory();
  return events.reduce<ActivityState>(
    (state, event) => foldSubagentEvent(state, event as unknown as SubagentEvent, memory),
    { groups: {} },
  );
}

describe("foldSubagentEvent run totals and traces", () => {
  it("keeps each run's token usage and trace, and each agent's trace, for the turn footer and feedback", () => {
    const state = fold([
      { type: "RUN_STARTED", runId: "r1" },
      {
        type: "SUBAGENT_STARTED",
        subagentRunId: "main.analyst",
        name: "analyst",
        parentToolCallId: "c1",
        metadata: { traceId: "b".repeat(32) },
      },
      {
        type: "RUN_FINISHED",
        runId: "r1",
        usage: [
          { model: "a", inputTokens: 10, outputTokens: 4, totalTokens: 14, cachedInputTokens: 6 },
          { model: "b", inputTokens: 5, outputTokens: 1, totalTokens: 6 },
        ],
        metadata: { traceId: "a".repeat(32) },
      },
    ]);
    expect(state.usageByRun?.r1).toEqual({ inputTokens: 15, outputTokens: 5, totalTokens: 20, cacheReadInputTokens: 6 });
    expect(state.traceByRun?.r1).toBe("a".repeat(32));
    expect(state.groups["main.analyst"].traceId).toBe("b".repeat(32));
  });
});

describe("foldSubagentEvent tool labels", () => {
  it("shows a tool by the label the workflow gives it", () => {
    const { groups } = fold([
      { type: "SUBAGENT_STARTED", subagentRunId: "main.researcher", name: "researcher", parentToolCallId: "c1" },
      {
        type: "TOOL_CALL_START",
        subagentRunId: "main.researcher",
        toolCallId: "t1",
        toolCallName: "web-research___search",
        metadata: { label: "Searching the web" },
      },
    ]);
    expect(groups["main.researcher"].tools[0]).toMatchObject({ toolName: "web-research___search", toolLabel: "Searching the web" });
  });
});

describe("foldSubagentEvent tool results", () => {
  const started = { type: "SUBAGENT_STARTED", subagentRunId: "main.analyst", name: "analyst", parentToolCallId: "c1" };

  it("reads an errored result's status, error and fix from its metadata, with the call's timing", () => {
    const { groups } = fold([
      started,
      { type: "TOOL_CALL_START", subagentRunId: "main.analyst", toolCallId: "t1", toolCallName: "run_sql", timestamp: 1000 },
      {
        type: "TOOL_CALL_RESULT",
        subagentRunId: "main.analyst",
        toolCallId: "t1",
        messageId: "r1",
        content: 'relation "orders" does not exist',
        timestamp: 1250,
        metadata: { status: "error", error: "Table orders not found", fix: "List the tables first", label: "Running SQL" },
      },
      { type: "TOOL_CALL_START", subagentRunId: "main.analyst", toolCallId: "t2", toolCallName: "run_sql", timestamp: 2000 },
      {
        type: "TOOL_CALL_RESULT",
        subagentRunId: "main.analyst",
        toolCallId: "t2",
        messageId: "r2",
        content: "1 row",
        timestamp: 2100,
        metadata: { status: "success" },
      },
    ]);

    expect(groups["main.analyst"].tools).toEqual([
      {
        toolUseId: "t1",
        toolName: "run_sql",
        toolLabel: "Running SQL",
        status: "error",
        toolResult: 'relation "orders" does not exist',
        error: "Table orders not found",
        fix: "List the tables first",
        startedAt: 1000,
        endedAt: 1250,
      },
      { toolUseId: "t2", toolName: "run_sql", status: "success", toolResult: "1 row", startedAt: 2000, endedAt: 2100 },
    ]);
  });

  it("times a call by when its events were folded when they carry no timestamp", () => {
    const now = vi.spyOn(Date, "now").mockReturnValueOnce(5000).mockReturnValueOnce(5300);
    const { groups } = fold([
      started,
      { type: "TOOL_CALL_START", subagentRunId: "main.analyst", toolCallId: "t1", toolCallName: "run_sql" },
      { type: "TOOL_CALL_RESULT", subagentRunId: "main.analyst", toolCallId: "t1", messageId: "r1", content: "ok" },
    ]);
    now.mockRestore();

    expect(groups["main.analyst"].tools[0]).toMatchObject({ status: "success", startedAt: 5000, endedAt: 5300 });
  });

  it("keeps why a sub-agent failed, and stops a cancelled one without an error", () => {
    const { groups } = fold([
      started,
      { type: "SUBAGENT_STARTED", subagentRunId: "main.writer", name: "writer", parentToolCallId: "c2" },
      { type: "SUBAGENT_ERROR", subagentRunId: "main.analyst", message: "Model quota exceeded", code: "MODEL_ERROR" },
      { type: "SUBAGENT_ERROR", subagentRunId: "main.writer", message: "Cancelled", code: "CANCELLED" },
    ]);

    expect(groups["main.analyst"]).toMatchObject({ status: "error", error: "Model quota exceeded" });
    expect(groups["main.writer"].status).toBe("stopped");
    expect(groups["main.writer"].error).toBeUndefined();
  });
});

describe("foldSubagentEvent structured results", () => {
  it("keeps a structured result with the name of its schema, for the app's renderer", () => {
    const { groups } = fold([
      { type: "SUBAGENT_STARTED", subagentRunId: "main.tracker", name: "tracker", parentToolCallId: "c1" },
      {
        type: "SUBAGENT_FINISHED",
        subagentRunId: "main.tracker",
        result: { order_id: "42", status: "shipped" },
        metadata: { outputSchema: "OrderCard" },
      },
    ]);
    expect(groups["main.tracker"]).toMatchObject({
      structuredOutput: { order_id: "42", status: "shipped" },
      outputSchemaName: "OrderCard",
    });
  });
});

describe("foldSubagentEvent on a recorded lab run", () => {
  const events = recorded("delegate-dashboard");

  it("is a stream AG-UI accepts", async () => {
    await expect(lastValueFrom(from(events as unknown as BaseEvent[]).pipe(verifyEvents(false), toArray()))).resolves.toHaveLength(
      events.length,
    );
  });

  it("builds the delegate tree: the analyst under the main call, the visualizer under the analyst", () => {
    const { groups } = fold(events);
    const analyze = groups["orchestrator.analyze"];
    const visualizer = groups["orchestrator.analyze.visualizer"];
    expect(analyze).toMatchObject({ agentName: "analyze", parentGroup: null, status: "completed", title: "Analyzing the data" });
    expect(visualizer).toMatchObject({ agentName: "visualizer", parentGroup: "orchestrator.analyze", status: "completed" });
    expect(analyze.tools.map((tool) => [tool.toolName, tool.status])).toEqual([
      ["sql-workbench___run_adhoc_sql", "success"],
      ["sql-workbench___create_queries", "success"],
      ["visualizer", "success"],
    ]);
    expect(visualizer.tools.find((tool) => tool.toolName === "dashboard___plot_widgets")?.toolInput).toMatchObject({
      dashboard_id: "d_2",
    });
  });

  it("replays the same cards after the runtime compacts the run", () => {
    const compacted = compactEvents(events as unknown as BaseEvent[]) as unknown as Record<string, unknown>[];
    expect(compacted.length).toBeLessThan(events.length);
    expect(fold(compacted)).toEqual(fold(events));
  });

  it("anchors each top-level sub-agent at a call in the main transcript", () => {
    const { groups } = fold(events);
    const mainCalls = new Set(
      events.filter((event) => event.type === "TOOL_CALL_START" && !event.subagentRunId).map((event) => event.toolCallId),
    );
    for (const group of Object.values(groups).filter((g) => g.parentGroup === null)) {
      expect(mainCalls.has(group.toolCallId as string)).toBe(true);
    }
  });
});

describe("parsePartialJson", () => {
  it("closes what is still open so streaming arguments render", () => {
    expect(parsePartialJson('{"items": [{"type": "kpi", "title": "Chu')).toEqual({ items: [{ type: "kpi", title: "Chu" }] });
    expect(parsePartialJson('{"a": 1,')).toEqual({ a: 1 });
    expect(parsePartialJson("")).toBeUndefined();
  });
});
