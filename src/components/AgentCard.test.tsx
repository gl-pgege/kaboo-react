import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState, StreamGroup, ToolCall } from "../types";
import { AgentCard } from "./AgentCard";

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

function withActivity(groups: Record<string, StreamGroup>, node: ReactNode) {
  const state: ActivityState = { groups };
  return <ActivityContext.Provider value={state}>{node}</ActivityContext.Provider>;
}

describe("AgentCard cancellation echo", () => {
  it("does not render a bare {\"status\":\"cancelled\"} delegate result", () => {
    const g = group({ agentName: "researcher", title: "Researcher", status: "completed" });
    render(
      withActivity(
        { "coordinator.researcher": g },
        <AgentCard groupId="coordinator.researcher" group={g} result='{"status":"cancelled"}' />,
      ),
    );

    expect(screen.queryByText(/"status"\s*:\s*"cancelled"/)).toBeNull();
    expect(screen.queryByText(/status: cancelled/)).toBeNull();
  });

  it("does not render a bare {\"status\":\"approved\"} delegate result", () => {
    const g = group({ agentName: "researcher", title: "Researcher", status: "completed" });
    render(
      withActivity(
        { "coordinator.researcher": g },
        <AgentCard groupId="coordinator.researcher" group={g} result='{"status":"approved"}' />,
      ),
    );

    expect(screen.queryByText(/"status"\s*:\s*"approved"/)).toBeNull();
    expect(screen.queryByText(/status: approved/)).toBeNull();
  });

  it("still renders a genuine delegate result", () => {
    const g = group({ agentName: "researcher", title: "Researcher", status: "completed" });
    render(
      withActivity(
        { "coordinator.researcher": g },
        <AgentCard groupId="coordinator.researcher" group={g} result="Here is the answer." />,
      ),
    );

    expect(screen.getByText("Here is the answer.")).toBeInTheDocument();
  });
});

describe("AgentCard recursion", () => {
  it("renders directChildren as nested cards when showChildren is set", () => {
    const groups = {
      "team.writer": group({ agentName: "writer", parentGroup: "team", title: "Writer" }),
      "team.writer.helper": group({
        agentName: "helper",
        parentGroup: "team.writer",
        title: "Helper",
      }),
    };

    render(
      withActivity(
        groups,
        <AgentCard groupId="team.writer" group={groups["team.writer"]} showChildren />,
      ),
    );

    expect(screen.getByText("Writer")).toBeInTheDocument();
    expect(screen.getByText("Helper")).toBeInTheDocument();
  });

  it("renders revisited agents (#2) as sibling cards, not a merged one (R3)", () => {
    const groups = {
      "team.planner": group({ agentName: "planner", parentGroup: "team", title: "Planner" }),
      "team.planner#2": group({
        agentName: "planner",
        parentGroup: "team",
        title: "Planner (revisit)",
      }),
    };

    // A synthetic parent to hang both revisits off of.
    const parent = group({ agentName: "team", parentGroup: null, title: "Team" });
    render(
      withActivity(
        { team: parent, ...groups },
        <AgentCard groupId="team" group={parent} showChildren />,
      ),
    );

    expect(screen.getByText("Planner")).toBeInTheDocument();
    expect(screen.getByText("Planner (revisit)")).toBeInTheDocument();
  });

  it("suppresses answer text only for the chat-reply card, keeps tools (R4)", () => {
    const tool: ToolCall = {
      toolUseId: "t1",
      toolName: "search",
      status: "success",
      toolResult: "ok",
    };
    const chatOutput = group({
      agentName: "writer",
      title: "Writer",
      isChatReply: true,
      timeline: [
        { type: "text", text: "THE FINAL ANSWER" },
        { type: "tool", tool },
      ],
    });

    render(withActivity({ w: chatOutput }, <AgentCard groupId="w" group={chatOutput} showChildren />));

    // The chat-reply text is the chat bubble already; it must not repeat here.
    expect(screen.queryByText("THE FINAL ANSWER")).toBeNull();
    // But the tool row is still shown.
    expect(screen.getByText(/search/)).toBeInTheDocument();
  });

  it("keeps a non-chat-reply member's findings text in its inline card", () => {
    const member = group({
      agentName: "researcher",
      title: "Researcher",
      // no isChatReply → this agent's text is real work, not the bubble
      timeline: [{ type: "text", text: "MARKET FINDINGS" }],
    });

    render(withActivity({ r: member }, <AgentCard groupId="r" group={member} showChildren />));

    expect(screen.getByText("MARKET FINDINGS")).toBeInTheDocument();
  });

  it("shows the task the agent was given from group.task", () => {
    const member = group({ agentName: "researcher", title: "Researcher", task: "Gather GPU pricing data" });

    render(withActivity({ r: member }, <AgentCard groupId="r" group={member} showChildren />));

    expect(screen.getByText(/Gather GPU pricing data/)).toBeInTheDocument();
  });

  it("keeps the full timeline (text included) when not inline", () => {
    const withText = group({
      title: "Writer",
      timeline: [{ type: "text", text: "VISIBLE IN DRILL" }],
    });

    render(withActivity({ w: withText }, <AgentCard groupId="w" group={withText} />));

    expect(screen.getByText("VISIBLE IN DRILL")).toBeInTheDocument();
  });

  it("auto-collapses a plain card on completion, hiding its timeline", () => {
    const active = group({ title: "Worker", timeline: [{ type: "text", text: "FINDINGS" }] });
    const { rerender } = render(withActivity({ w: active }, <AgentCard groupId="w" group={active} />));
    expect(screen.getByText("FINDINGS")).toBeInTheDocument();

    const done = { ...active, status: "completed" as const };
    rerender(withActivity({ w: done }, <AgentCard groupId="w" group={done} />));
    expect(screen.queryByText("FINDINGS")).toBeNull();
  });

  it("keeps a card with an ask_user interaction expanded on completion", () => {
    const askTool: ToolCall = {
      toolUseId: "a1",
      toolName: "ask_user",
      status: "success",
      toolInput: { questions: [{ question: "Which segment?", type: "radio", options: ["GPUs", "APIs"] }] },
      toolResult: JSON.stringify({ "Which segment?": "GPUs" }),
    };
    const active = group({
      title: "Researcher",
      tools: [askTool],
      timeline: [{ type: "tool", tool: askTool }],
    });
    const { rerender } = render(withActivity({ r: active }, <AgentCard groupId="r" group={active} />));

    const done = { ...active, status: "completed" as const };
    rerender(withActivity({ r: done }, <AgentCard groupId="r" group={done} />));

    // Stays expanded: the answered Q&A remains visible after completion.
    expect(screen.getByText("Which segment?")).toBeInTheDocument();
    expect(screen.getByText("GPUs")).toBeInTheDocument();
  });
});
