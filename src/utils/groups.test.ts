import { describe, it, expect } from "vitest";
import type { StreamGroup } from "../types";
import type { TimelineEntry, ToolCall } from "../types";
import {
  topLevelGroups,
  directChildren,
  findGroupForCard,
  chatRootGroups,
  latestRunId,
  partitionChildrenByToolCall,
  pendingToolAnchorExists,
  groupTurnKey,
  type GroupEntry,
} from "./groups";

function group(overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: "Group",
    agentName: "agent",
    parentGroup: null,
    status: "active",
    tools: [],
    tokens: "",
    timeline: [],
    ...overrides,
  };
}

describe("topLevelGroups", () => {
  it("returns only groups without a parent", () => {
    const groups = {
      root: group({ agentName: "coordinator", parentGroup: null }),
      child: group({ agentName: "researcher", parentGroup: "root" }),
      other: group({ agentName: "analyst", parentGroup: null }),
    };

    const ids = topLevelGroups(groups).map(([id]) => id);

    expect(ids).toEqual(["root", "other"]);
  });

  it("returns an empty list when every group has a parent", () => {
    const groups = { a: group({ parentGroup: "root" }) };
    expect(topLevelGroups(groups)).toEqual([]);
  });

  it("does not treat a group id containing dots as nested", () => {
    const groups = { "a.b.c": group({ parentGroup: null }) };
    expect(topLevelGroups(groups).map(([id]) => id)).toEqual(["a.b.c"]);
  });
});

describe("directChildren", () => {
  it("returns only one level of children of the given parent", () => {
    const groups = {
      root: group({ parentGroup: null }),
      a: group({ parentGroup: "root" }),
      b: group({ parentGroup: "root" }),
      grandchild: group({ parentGroup: "a" }),
    };

    const ids = directChildren(groups, "root").map(([id]) => id);

    expect(ids).toEqual(["a", "b"]);
  });

  it("returns nothing for a parent with no children", () => {
    const groups = { root: group({ parentGroup: null }) };
    expect(directChildren(groups, "root")).toEqual([]);
  });
});

describe("findGroupForCard", () => {
  const groups = {
    "grp-1": group({ agentName: "research_team", toolCallId: "tc-1" }),
    "grp-2": group({ agentName: "research_team", toolCallId: "tc-2" }),
    "grp-3": group({ agentName: "analyst", toolCallId: "tc-3" }),
  };

  it("matches on both agentName and toolCallId", () => {
    const entry = findGroupForCard(groups, "research_team", "tc-2");
    expect(entry?.[0]).toBe("grp-2");
  });

  it("returns undefined when the agent matches but the toolCallId does not", () => {
    expect(findGroupForCard(groups, "research_team", "tc-999")).toBeUndefined();
  });

  it("returns undefined when the toolCallId matches but the agent does not", () => {
    expect(findGroupForCard(groups, "writer", "tc-1")).toBeUndefined();
  });

  it("does not correlate a group that has no toolCallId", () => {
    const orphan = { "grp-x": group({ agentName: "research_team", toolCallId: null }) };
    expect(findGroupForCard(orphan, "research_team", "tc-1")).toBeUndefined();
  });
});

describe("chatRootGroups", () => {
  it("includes top-level no-toolCallId groups (first-class swarm/graph)", () => {
    const groups = {
      "team.planner": group({ agentName: "planner", parentGroup: "team" }),
      "team.writer": group({ agentName: "writer", parentGroup: "team" }),
    };
    // parent "team" (the entry orchestration) is filtered out of the stream, so
    // both members are chat-roots.
    const ids = chatRootGroups(groups).map(([id]) => id);
    expect(ids).toEqual(["team.planner", "team.writer"]);
  });

  it("treats a present parent as nesting, not a root", () => {
    const groups = {
      "pipe.sw": group({ agentName: "sw", parentGroup: "pipe" }),
      "pipe.sw.lead": group({ agentName: "lead", parentGroup: "pipe.sw" }),
    };
    // pipe.sw's parent (pipe) is absent → root; lead's parent (pipe.sw) is
    // present → nested, so only pipe.sw is a chat-root.
    const ids = chatRootGroups(groups).map(([id]) => id);
    expect(ids).toEqual(["pipe.sw"]);
  });

  it("excludes delegate groups that carry a toolCallId (R5)", () => {
    const groups = {
      "team.planner": group({ agentName: "planner", parentGroup: "team" }),
      delegated: group({ agentName: "researcher", parentGroup: null, toolCallId: "tc-1" }),
    };
    const ids = chatRootGroups(groups).map(([id]) => id);
    expect(ids).toEqual(["team.planner"]);
  });

  it("excludes a plain-agent entry group (inlineChatOwner)", () => {
    const groups = {
      research_pipeline: group({
        agentName: "research_pipeline",
        parentGroup: null,
        inlineChatOwner: true,
      }),
      "team.writer": group({ agentName: "writer", parentGroup: "team" }),
    };
    // The entry group's tools are rendered inline by the host, so it must not
    // become its own card — only the swarm member remains a chat-root.
    const ids = chatRootGroups(groups).map(([id]) => id);
    expect(ids).toEqual(["team.writer"]);
  });
});

describe("partitionChildrenByToolCall", () => {
  const toolEntry = (toolUseId: string): TimelineEntry => ({
    type: "tool",
    tool: { toolUseId, toolName: "field_researcher" } as ToolCall,
  });

  it("anchors a delegated child to its delegating tool call, keyed by tool-use id", () => {
    const childEntries: GroupEntry[] = [
      ["coord.team.researcher", group({ toolCallId: "tc-1" })],
    ];
    const timeline: TimelineEntry[] = [toolEntry("tc-1"), { type: "text", text: "summary" }];

    const { byToolCall, leftover } = partitionChildrenByToolCall(childEntries, timeline);

    expect(byToolCall.get("tc-1")?.[0]).toBe("coord.team.researcher");
    expect(leftover).toEqual([]);
  });

  it("leaves children without a matching tool call (swarm/graph members) in leftover", () => {
    const childEntries: GroupEntry[] = [
      ["team.planner", group({ toolCallId: null })],
      ["team.writer", group({ toolCallId: "tc-absent" })],
    ];
    const timeline: TimelineEntry[] = [toolEntry("tc-1")];

    const { byToolCall, leftover } = partitionChildrenByToolCall(childEntries, timeline);

    expect(byToolCall.size).toBe(0);
    expect(leftover.map(([id]) => id)).toEqual(["team.planner", "team.writer"]);
  });
});

describe("pendingToolAnchorExists", () => {
  const askTool = (overrides: Partial<ToolCall> = {}): ToolCall => ({
    toolUseId: "tc-1",
    toolName: "ask_user",
    status: "running",
    ...overrides,
  });

  it("finds a pending ask_user tool by tool-call id (a card will render it inline)", () => {
    const groups = {
      "team.researcher": group({ tools: [askTool()] }),
    };
    expect(pendingToolAnchorExists(groups, "tc-1")).toBe(true);
  });

  it("finds a pending gated (non-ask_user) tool so its approval anchors inline", () => {
    const groups = {
      "team.researcher": group({
        tools: [askTool({ toolName: "research_search_web", toolUseId: "tc-2" })],
      }),
    };
    expect(pendingToolAnchorExists(groups, "tc-2")).toBe(true);
  });

  it("returns false once the tool has a result (no live prompt to anchor)", () => {
    const groups = {
      "team.researcher": group({ tools: [askTool({ toolResult: "{\"q\":\"a\"}" })] }),
    };
    expect(pendingToolAnchorExists(groups, "tc-1")).toBe(false);
  });

  it("returns false for a missing or unknown id", () => {
    const groups = {
      "team.researcher": group({ tools: [askTool({ toolUseId: "tc-2" })] }),
    };
    expect(pendingToolAnchorExists(groups, "tc-1")).toBe(false);
    expect(pendingToolAnchorExists(groups, undefined)).toBe(false);
  });
});

describe("latestRunId", () => {
  it("returns the most recent run id by arrival order", () => {
    const entries: [string, StreamGroup][] = [
      ["a", group({ runId: "run-1" })],
      ["b", group({ runId: "run-2" })],
    ];
    expect(latestRunId(entries)).toBe("run-2");
  });

  it("returns null when no group carries a run id", () => {
    const entries: [string, StreamGroup][] = [["a", group({})]];
    expect(latestRunId(entries)).toBeNull();
  });
});

describe("groupTurnKey", () => {
  it("prefers the stable turnId over runId", () => {
    expect(groupTurnKey(group({ turnId: "turn-1", runId: "run-9" }))).toBe("turn-1");
  });

  it("falls back to runId when there is no turnId (older streams)", () => {
    expect(groupTurnKey(group({ runId: "run-9" }))).toBe("run-9");
  });

  it("returns null when neither is present", () => {
    expect(groupTurnKey(group({}))).toBeNull();
  });
});
