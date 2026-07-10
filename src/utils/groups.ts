import type { StreamGroup, TimelineEntry } from "../types";

export type GroupEntry = [string, StreamGroup];

/**
 * Stable per-turn key for a group. Prefers the server-stamped `turnId` (stable
 * across an interrupt/resume), falling back to `runId` for older streams that
 * don't carry one. `null` when neither is present.
 */
export function groupTurnKey(g: StreamGroup): string | null {
  return g.turnId ?? g.runId ?? null;
}

/**
 * Split child groups into those anchored to a delegating tool call present in
 * *timeline* (keyed by that tool-call id, so they can be interleaved at their
 * chronological position) and the leftover (swarm/graph members and any child
 * whose spawning tool call isn't in this timeline), which render in a trailing
 * section. Keeps a delegated sub-agent's card at the point it was delegated,
 * instead of after the parent's summary text.
 */
export function partitionChildrenByToolCall(
  childEntries: GroupEntry[],
  timeline: TimelineEntry[],
): { byToolCall: Map<string, GroupEntry>; leftover: GroupEntry[] } {
  const toolUseIds = new Set(
    timeline.filter((e) => e.type === "tool").map((e) => e.tool.toolUseId),
  );
  const byToolCall = new Map<string, GroupEntry>();
  const leftover: GroupEntry[] = [];
  for (const [id, g] of childEntries) {
    if (g.toolCallId && toolUseIds.has(g.toolCallId)) {
      byToolCall.set(g.toolCallId, [id, g]);
    } else {
      leftover.push([id, g]);
    }
  }
  return { byToolCall, leftover };
}

/**
 * Top-level groups are those without a parent. Uses the explicit
 * `parentGroup` field rather than parsing dot-paths out of the group id, so
 * group names are free to contain any characters.
 */
export function topLevelGroups(
  groups: Record<string, StreamGroup>,
): GroupEntry[] {
  return Object.entries(groups).filter(([, g]) => g.parentGroup == null);
}

/** Direct children of `parentId` (one level deep) via the `parentGroup` field. */
export function directChildren(
  groups: Record<string, StreamGroup>,
  parentId: string,
): GroupEntry[] {
  return Object.entries(groups).filter(([, g]) => g.parentGroup === parentId);
}

/**
 * Root groups to render inline in the chat for a first-class swarm/graph entry.
 *
 * These are member runs that are NOT spawned by a delegate tool call (no
 * `toolCallId`, so they can't be anchored via CopilotKit's tool renderer) and
 * that sit at the top of the visible tree — either genuinely parentless, or
 * parented by the entry orchestration whose own group is filtered out of the
 * stream (so its parent id is absent from the map). Delegate sub-agent groups
 * always carry a `toolCallId` and are therefore excluded, preserving the
 * tool-call-anchored path.
 *
 * A plain-agent entry group (`inlineChatOwner`) is also excluded: its text and
 * tools are already rendered inline by the host, so it enriches those tool rows
 * without ever becoming its own card.
 */
export function chatRootGroups(
  groups: Record<string, StreamGroup>,
): GroupEntry[] {
  return Object.entries(groups).filter(
    ([, g]) =>
      !g.toolCallId &&
      !g.inlineChatOwner &&
      (g.parentGroup == null || groups[g.parentGroup] === undefined),
  );
}

/**
 * The most recent `runId` among the given entries (insertion order = arrival
 * order), or `null` when none carry a run id. Used to scope inline cards to the
 * current turn.
 */
export function latestRunId(entries: GroupEntry[]): string | null {
  let latest: string | null = null;
  for (const [, g] of entries) {
    if (g.runId) latest = g.runId;
  }
  return latest;
}

/**
 * True when a still-pending tool call with the given tool-call id exists in some
 * group's timeline. That tool row is the chronological home for the live prompt
 * (an `ask_user` form or a gated-tool approval), so the owning agent card
 * renders it inline there — and the top-level / drill interrupt slots suppress
 * it to avoid a duplicate that would float out of order. Returns `false` (no
 * anchor) when no such tool is present, so those slots still render the prompt
 * as a fallback.
 */
export function pendingToolAnchorExists(
  groups: Record<string, StreamGroup>,
  toolCallId: string | undefined,
): boolean {
  if (!toolCallId) return false;
  for (const g of Object.values(groups)) {
    for (const t of g.tools) {
      if (t.toolUseId === toolCallId && t.toolResult == null) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Correlate an inline chat card to its activity group by the delegate tool call
 * that spawned it. A group carries the AG-UI `toolCallId` of the coordinator's
 * delegating call (stamped server-side); the same id is exposed by CopilotKit's
 * v2 tool renderer, so matching on `(agentName, toolCallId)` is stable across
 * re-renders and independent of arrival order.
 */
export function findGroupForCard(
  groups: Record<string, StreamGroup>,
  agentName: string,
  toolCallId: string,
): GroupEntry | undefined {
  return Object.entries(groups).find(
    ([, g]) => g.agentName === agentName && g.toolCallId === toolCallId,
  );
}
