import type { ActivityState, StreamGroup, TokenUsage, ToolCall } from "../types";

/** The fields of an AG-UI event this fold reads. */
export interface SubagentEvent {
  type: string;
  runId?: string;
  subagentRunId?: string;
  name?: string;
  parentToolCallId?: string;
  parentSubagentRunId?: string;
  metadata?: Record<string, unknown>;
  messageId?: string;
  delta?: string;
  toolCallId?: string;
  toolCallName?: string;
  content?: unknown;
  result?: unknown;
  outcome?: { type?: string };
  message?: string;
  code?: string;
  usage?: Array<Record<string, unknown>>;
}

/**
 * What the fold remembers between events: the run streaming, partial arguments,
 * and which sub-agent started each message and call. A compacted replay (AG-UI's
 * `compactEvents`) merges text and argument deltas into events without a
 * `subagentRunId`; they belong to whoever started them.
 */
export interface SubagentFoldMemory {
  runId?: string;
  args: Map<string, string>;
  texts: Map<string, number>;
  owners: Map<string, string>;
}

export function newFoldMemory(): SubagentFoldMemory {
  return { args: new Map(), texts: new Map(), owners: new Map() };
}

function startedBy(event: SubagentEvent, memory: SubagentFoldMemory): string | undefined {
  const key =
    event.type === "TEXT_MESSAGE_CONTENT"
      ? event.messageId
      : event.type === "TOOL_CALL_ARGS" || event.type === "TOOL_CALL_RESULT"
        ? event.toolCallId
        : undefined;
  return key ? memory.owners.get(key) : undefined;
}

/**
 * Best-effort parse of JSON that may still be streaming: closes the strings,
 * arrays and objects left open so a partial argument list can already render.
 */
export function parsePartialJson(text: string): unknown {
  if (!text.trim()) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // Not complete yet; close what is open below.
  }
  const closers: string[] = [];
  let inString = false;
  let escaped = false;
  for (const char of text) {
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") closers.push("}");
    else if (char === "[") closers.push("]");
    else if (char === "}" || char === "]") closers.pop();
  }
  let candidate = text;
  if (inString) candidate += '"';
  candidate = candidate.replace(/[,:]\s*$/, "");
  candidate += closers.reverse().join("");
  try {
    return JSON.parse(candidate);
  } catch {
    return undefined;
  }
}

function tokenUsage(metadata: Record<string, unknown> | undefined): TokenUsage | undefined {
  const usage = metadata?.usage as Record<string, number> | undefined;
  if (!usage) return undefined;
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
    totalTokens: usage.totalTokens ?? 0,
    ...(usage.cachedInputTokens ? { cacheReadInputTokens: usage.cachedInputTokens } : {}),
    ...(usage.cacheWriteInputTokens ? { cacheWriteInputTokens: usage.cacheWriteInputTokens } : {}),
    ...(typeof metadata?.cost === "number" ? { cost: metadata.cost } : {}),
  };
}

function runUsage(entries: Array<Record<string, unknown>> | undefined): TokenUsage | undefined {
  if (!entries?.length) return undefined;
  const sum = (key: string) => entries.reduce((total, entry) => total + (Number(entry[key]) || 0), 0);
  const cacheRead = sum("cachedInputTokens");
  const cacheWrite = sum("cacheWriteInputTokens");
  return {
    inputTokens: sum("inputTokens"),
    outputTokens: sum("outputTokens"),
    totalTokens: sum("totalTokens"),
    ...(cacheRead ? { cacheReadInputTokens: cacheRead } : {}),
    ...(cacheWrite ? { cacheWriteInputTokens: cacheWrite } : {}),
  };
}

function finishRun(state: ActivityState, event: SubagentEvent, memory: SubagentFoldMemory): ActivityState {
  const runId = event.runId ?? memory.runId;
  const usage = runUsage(event.usage);
  const traceId = event.metadata?.traceId;
  if (!runId || (!usage && typeof traceId !== "string")) return state;
  return {
    ...state,
    ...(usage ? { usageByRun: { ...state.usageByRun, [runId]: usage } } : {}),
    ...(typeof traceId === "string" ? { traceByRun: { ...state.traceByRun, [runId]: traceId } } : {}),
  };
}

function withGroup(
  state: ActivityState,
  id: string,
  change: (group: StreamGroup) => StreamGroup,
): ActivityState {
  const group = state.groups[id];
  if (!group) return state;
  return { ...state, groups: { ...state.groups, [id]: change(group) } };
}

function withTool(group: StreamGroup, toolUseId: string, change: (tool: ToolCall) => ToolCall): StreamGroup {
  return { ...group, tools: group.tools.map((tool) => (tool.toolUseId === toolUseId ? change(tool) : tool)) };
}

/**
 * Fold one AG-UI event into the sub-agent groups the cards render. Sub-agents
 * arrive as `SUBAGENT_STARTED` / `SUBAGENT_FINISHED` / `SUBAGENT_ERROR`, with
 * their text and tool calls tagged by `subagentRunId`; each invocation is one
 * group, keyed by that id, attached to the call that started it.
 *
 * @param state - The groups so far.
 * @param event - The event.
 * @param memory - What the fold keeps between events (see {@link newFoldMemory}).
 * @returns The groups after the event; the same object when it changed nothing.
 */
export function foldSubagentEvent(
  state: ActivityState,
  event: SubagentEvent,
  memory: SubagentFoldMemory,
): ActivityState {
  if (event.type === "RUN_STARTED") {
    memory.runId = event.runId;
    return state;
  }
  if (event.type === "RUN_FINISHED") return finishRun(state, event, memory);
  const id = event.subagentRunId ?? startedBy(event, memory);
  if (!id) return state;
  switch (event.type) {
    case "SUBAGENT_STARTED": {
      const existing = state.groups[id];
      const runId = memory.runId ?? null;
      if (existing) {
        return withGroup(state, id, (group) => ({
          ...group,
          status: "active",
          runIds: runId && !group.runIds?.includes(runId) ? [...(group.runIds ?? []), runId] : group.runIds,
        }));
      }
      const metadata = event.metadata ?? {};
      const group: StreamGroup = {
        title: typeof metadata.title === "string" ? metadata.title : (event.name ?? id),
        agentName: event.name ?? id,
        parentGroup: event.parentSubagentRunId ?? null,
        toolCallId: event.parentToolCallId ?? null,
        task: typeof metadata.task === "string" ? metadata.task : null,
        ...(typeof metadata.traceId === "string" ? { traceId: metadata.traceId } : {}),
        runId,
        runIds: runId ? [runId] : [],
        status: "active",
        tools: [],
        timeline: [],
      };
      return { ...state, groups: { ...state.groups, [id]: group } };
    }
    case "TEXT_MESSAGE_START":
      if (event.messageId) memory.owners.set(event.messageId, id);
      return withGroup(state, id, (group) => {
        if (event.messageId) memory.texts.set(event.messageId, group.timeline.length);
        return { ...group, timeline: [...group.timeline, { type: "text", text: "" }] };
      });
    case "TEXT_MESSAGE_CONTENT":
      return withGroup(state, id, (group) => {
        const index = event.messageId ? memory.texts.get(event.messageId) : undefined;
        if (index === undefined) {
          return { ...group, timeline: [...group.timeline, { type: "text", text: event.delta ?? "" }] };
        }
        const timeline = [...group.timeline];
        const entry = timeline[index];
        if (entry?.type === "text") timeline[index] = { type: "text", text: entry.text + (event.delta ?? "") };
        return { ...group, timeline };
      });
    case "TOOL_CALL_START": {
      const toolUseId = event.toolCallId;
      if (!toolUseId) return state;
      memory.args.set(toolUseId, "");
      memory.owners.set(toolUseId, id);
      const label = event.metadata?.label;
      return withGroup(state, id, (group) =>
        group.tools.some((tool) => tool.toolUseId === toolUseId)
          ? withTool(group, toolUseId, (tool) => ({ ...tool, status: "running" }))
          : {
              ...group,
              tools: [
                ...group.tools,
                {
                  toolUseId,
                  toolName: event.toolCallName ?? "",
                  ...(typeof label === "string" ? { toolLabel: label } : {}),
                  status: "running",
                },
              ],
              timeline: [...group.timeline, { type: "tool", toolUseId }],
            },
      );
    }
    case "TOOL_CALL_ARGS": {
      const toolUseId = event.toolCallId;
      if (!toolUseId) return state;
      const args = (memory.args.get(toolUseId) ?? "") + (event.delta ?? "");
      memory.args.set(toolUseId, args);
      const toolInput = parsePartialJson(args);
      if (toolInput === undefined) return state;
      return withGroup(state, id, (group) => withTool(group, toolUseId, (tool) => ({ ...tool, toolInput })));
    }
    case "TOOL_CALL_RESULT": {
      const toolUseId = event.toolCallId;
      if (!toolUseId) return state;
      const toolResult = typeof event.content === "string" ? event.content : JSON.stringify(event.content);
      return withGroup(state, id, (group) =>
        withTool(group, toolUseId, (tool) => ({ ...tool, toolResult, status: "success" })),
      );
    }
    case "SUBAGENT_FINISHED": {
      const usage = tokenUsage(event.metadata);
      const result = event.result;
      const schema = event.metadata?.outputSchema;
      return withGroup(state, id, (group) => ({
        ...group,
        status: event.outcome?.type === "suspended" ? "interrupted" : "completed",
        ...(usage ? { usage } : {}),
        ...(result && typeof result === "object" && !Array.isArray(result)
          ? { structuredOutput: result as Record<string, unknown> }
          : {}),
        ...(typeof schema === "string" ? { outputSchemaName: schema } : {}),
      }));
    }
    case "SUBAGENT_ERROR":
      return withGroup(state, id, (group) => ({
        ...group,
        status: event.code === "CANCELLED" ? "stopped" : "error",
      }));
    default:
      return state;
  }
}
