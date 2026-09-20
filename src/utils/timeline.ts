import type { TimelineEntry, ToolCall } from "../types";

/**
 * The tool-call id of a timeline tool entry, from either shape it may arrive in.
 *
 * The producer emits `toolUseId` and keeps the tool itself once in the group's
 * `tools`. Snapshots written before that change embedded the whole `ToolCall`
 * in the entry instead, and threads persisted then still replay, so both are
 * read.
 */
export function timelineToolUseId(entry: TimelineEntry): string | undefined {
  if (entry.type !== "tool") return undefined;
  return entry.toolUseId ?? entry.tool?.toolUseId;
}

/**
 * Resolve a timeline tool entry to its {@link ToolCall}.
 *
 * *tools* is the owning group's `tools` list, which holds the single copy the
 * entry references. Returns `undefined` for a reference with no match, which a
 * caller should render as nothing rather than as an empty row.
 *
 * @example
 * ```ts
 * import { resolveTimelineTool } from "@pgege/kaboo-react";
 *
 * function firstToolName(group: { tools: ToolCall[]; timeline: TimelineEntry[] }) {
 *   for (const entry of group.timeline) {
 *     const tool = resolveTimelineTool(entry, group.tools);
 *     if (tool) return tool.toolName;
 *   }
 *   return null;
 * }
 * ```
 */
export function resolveTimelineTool(
  entry: TimelineEntry,
  tools: ToolCall[],
): ToolCall | undefined {
  if (entry.type !== "tool") return undefined;
  if (entry.tool) return entry.tool;
  return tools.find((t) => t.toolUseId === entry.toolUseId);
}
