import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState, StreamGroup } from "../types";

const { registered } = vi.hoisted(() => ({
  registered: [] as Array<{ name: string; render: (props: Record<string, unknown>) => ReactNode }>,
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  useRenderTool: (opts: { name: string; render: (props: Record<string, unknown>) => ReactNode }) => {
    registered.push(opts);
  },
  useDefaultRenderTool: () => {},
}));

vi.mock("../components/AgentCard", () => ({
  AgentCard: ({ group }: { group: StreamGroup }) => (
    <div data-testid="agent-card">{group.title}</div>
  ),
}));

import { KabooInlineCards } from "./KabooInlineCards";

function group(agentName: string, overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: `${agentName} card`,
    agentName,
    parentGroup: null,
    status: "active",
    tools: [],
    tokens: "",
    timeline: [],
    ...overrides,
  };
}

function withActivity(groups: Record<string, StreamGroup>, node: ReactNode) {
  const state: ActivityState = { groups };
  return <ActivityContext.Provider value={state}>{node}</ActivityContext.Provider>;
}

beforeEach(() => {
  registered.length = 0;
});

describe("KabooInlineCards", () => {
  it("registers exactly one tool renderer per distinct agent", () => {
    const groups = {
      a: group("research_team", { toolCallId: "tc-1" }),
      b: group("research_team", { toolCallId: "tc-2" }),
      c: group("analyst", { toolCallId: "tc-3" }),
    };

    render(withActivity(groups, <KabooInlineCards />));

    expect(registered.map((r) => r.name).sort()).toEqual(["analyst", "research_team"]);
  });

  it("renders the AgentCard for the group matching the tool call id", () => {
    const groups = {
      a: group("research_team", { toolCallId: "tc-1", title: "First run" }),
      b: group("research_team", { toolCallId: "tc-2", title: "Second run" }),
    };

    render(withActivity(groups, <KabooInlineCards />));
    const renderer = registered.find((r) => r.name === "research_team")!;

    render(
      withActivity(
        groups,
        renderer.render({ toolCallId: "tc-2", parameters: { input: "x" }, status: "inProgress" }),
      ),
    );

    expect(screen.getByTestId("agent-card")).toHaveTextContent("Second run");
  });

  it("shows a loading placeholder when no group matches the tool call id yet", () => {
    const groups = { a: group("research_team", { toolCallId: "tc-1" }) };

    render(withActivity(groups, <KabooInlineCards />));
    const renderer = registered.find((r) => r.name === "research_team")!;

    render(
      withActivity(
        groups,
        renderer.render({ toolCallId: "tc-unknown", parameters: {}, status: "inProgress" }),
      ),
    );

    expect(screen.queryByTestId("agent-card")).toBeNull();
    expect(screen.getByText(/Loading research_team/)).toBeInTheDocument();
  });

  it("does not render first-class swarm/graph roots (that is KabooAssistantMessage's job)", () => {
    const groups = {
      "team.planner": group("planner", {
        parentGroup: "team",
        runId: "run-1",
        title: "Planning",
      }),
      "team.writer": group("writer", {
        parentGroup: "team",
        runId: "run-1",
        title: "Writing",
      }),
    };

    render(withActivity(groups, <KabooInlineCards />));

    // No delegating tool call → nothing registered and nothing drawn here; the
    // swarm/graph cards render inside the chat via the custom-message renderer.
    expect(registered).toHaveLength(0);
    expect(screen.queryByText("Planning")).toBeNull();
    expect(screen.queryByText("Writing")).toBeNull();
  });

  it("registers a tool renderer only for delegate groups, never swarm roots (R5)", () => {
    const groups = {
      delegated: group("researcher", { toolCallId: "tc-1", title: "Delegated" }),
      "team.writer": group("writer", { parentGroup: "team", runId: "run-1", title: "Swarm member" }),
    };

    render(withActivity(groups, <KabooInlineCards />));

    // Delegate agent gets a tool renderer; the swarm root is left for
    // KabooAssistantMessage.
    expect(registered.map((r) => r.name)).toEqual(["researcher"]);
    expect(screen.queryByText("Swarm member")).toBeNull();
  });
});
