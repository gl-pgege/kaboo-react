import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import { ToolRenderersProvider } from "../context/ToolRenderers";
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

  it("says a sub-agent waiting on the person needs input", () => {
    const g = group({ agentName: "researcher", title: "Researcher", status: "interrupted" });
    render(withActivity({ "coordinator.researcher": g }, <AgentCard groupId="coordinator.researcher" group={g} />));

    expect(screen.getByText("needs input")).toBeInTheDocument();
    expect(screen.queryByText("working...")).toBeNull();
  });

  it("shows the answer once when the agent's own text already says it", () => {
    const g = group({
      agentName: "researcher",
      title: "Researcher",
      status: "completed",
      timeline: [{ type: "text", text: "Here is the answer." }],
    });
    render(
      withActivity(
        { "coordinator.researcher": g },
        <AgentCard groupId="coordinator.researcher" group={g} result="Here is the answer." />,
      ),
    );

    expect(screen.getAllByText("Here is the answer.")).toHaveLength(1);
  });
});

describe("AgentCard token usage chip", () => {
  it("renders a compact total-token chip when the group has usage", () => {
    const g = group({
      status: "completed",
      usage: { inputTokens: 48_200, outputTokens: 3_100, totalTokens: 51_300 },
    });
    render(withActivity({ g1: g }, <AgentCard groupId="g1" group={g} />));

    expect(screen.getByText("51.3k tok")).toBeInTheDocument();
    expect(screen.getByTitle("48,200 in / 3,100 out tokens")).toBeInTheDocument();
  });

  it("renders no chip without usage or with zero totals", () => {
    const bare = group({ status: "completed" });
    const zero = group({
      status: "completed",
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    });
    const { rerender } = render(withActivity({ g1: bare }, <AgentCard groupId="g1" group={bare} />));
    expect(screen.queryByText(/tok$/)).toBeNull();
    rerender(withActivity({ g1: zero }, <AgentCard groupId="g1" group={zero} />));
    expect(screen.queryByText(/tok$/)).toBeNull();
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
      tools: [tool],
      timeline: [
        { type: "text", text: "THE FINAL ANSWER" },
        { type: "tool", toolUseId: "t1" },
      ],
    });

    render(withActivity({ w: chatOutput }, <AgentCard groupId="w" group={chatOutput} showChildren />));

    // The chat-reply text is the chat bubble already; it must not repeat here.
    expect(screen.queryByText("THE FINAL ANSWER")).toBeNull();
    // But the tool row is still shown.
    expect(screen.getByText(/search/i)).toBeInTheDocument();
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
      toolInput: { questions: [{ question: "Which segment?", options: ["GPUs", "APIs"] }] },
      toolResult: JSON.stringify({ "Which segment?": "GPUs" }),
    };
    const active = group({
      title: "Researcher",
      tools: [askTool],
      timeline: [{ type: "tool", toolUseId: "a1" }],
    });
    const { rerender } = render(withActivity({ r: active }, <AgentCard groupId="r" group={active} />));

    const done = { ...active, status: "completed" as const };
    rerender(withActivity({ r: done }, <AgentCard groupId="r" group={done} />));

    // Stays expanded: the answered Q&A remains visible after completion.
    expect(screen.getByText("Which segment?")).toBeInTheDocument();
    expect(screen.getByText("GPUs")).toBeInTheDocument();
  });
});

describe("AgentCard task summary", () => {
  const handoff = JSON.stringify({
    input: "Plot **churn** by region",
    narrative: "Churn rose in APAC",
    dashboard_title: "Churn",
  });

  it("reads a JSON handoff as the text it carries, rendered as markdown", () => {
    const g = group({ title: "Visualizer", task: handoff });
    const { container } = render(withActivity({ v: g }, <AgentCard groupId="v" group={g} />));

    const task = container.querySelector(".kaboo-agent-card-task .kaboo-agent-card-task-text");
    expect(task?.textContent?.trim()).toBe("Plot churn by region");
    expect(task?.querySelector("strong")?.textContent).toBe("churn");
    expect(container.textContent).not.toContain("narrative");
  });

  it("joins a handoff's short fields when it has none of the usual keys", () => {
    const g = group({ title: "Visualizer", task: JSON.stringify({ dashboard_title: "Churn", region: "APAC", ids: [1, 2] }) });
    const { container } = render(withActivity({ v: g }, <AgentCard groupId="v" group={g} />));

    expect(container.querySelector(".kaboo-agent-card-task-text")?.textContent?.trim()).toBe(
      "dashboard title: Churn · region: APAC",
    );
  });

  it("clamps the collapsed task line, still normalized", () => {
    const active = group({ title: "Visualizer", task: handoff, timeline: [{ type: "text", text: "Working on it" }] });
    const { container, rerender } = render(withActivity({ v: active }, <AgentCard groupId="v" group={active} />));
    const done = { ...active, status: "completed" as const };
    rerender(withActivity({ v: done }, <AgentCard groupId="v" group={done} />));

    const collapsed = container.querySelector(".kaboo-agent-card-collapsed .kaboo-agent-card-task-text");
    expect(collapsed?.textContent?.trim()).toBe("Plot churn by region");
    expect(screen.queryByText("Working on it")).toBeNull();
  });

  it("keeps a plain-text task as it is", () => {
    const g = group({ title: "Researcher", task: "Gather {GPU} pricing data" });
    const { container } = render(withActivity({ r: g }, <AgentCard groupId="r" group={g} />));

    expect(container.querySelector(".kaboo-agent-card-task-text")?.textContent?.trim()).toBe("Gather {GPU} pricing data");
  });
});

describe("AgentCard error state", () => {
  it("shows a failed agent's error under its header, in the error style", () => {
    const g = group({ title: "Analyst", status: "error", error: "Model quota exceeded" });
    const { container } = render(withActivity({ a: g }, <AgentCard groupId="a" group={g} actionStatus="complete" />));

    expect(container.querySelector(".kaboo-agent-card")).toHaveClass("kaboo-agent-card-error");
    expect(screen.getByText("Model quota exceeded")).toHaveClass("kaboo-agent-card-error-text");
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.queryByText("done")).toBeNull();
    expect(screen.queryByText("Working...")).toBeNull();
  });
});

describe("AgentCard app overrides", () => {
  const finished = group({
    agentName: "visualizer",
    title: "Visualizer",
    status: "completed",
    task: "Build the dashboard",
    timeline: [{ type: "text", text: "Building it" }],
    structuredOutput: { dashboard_id: "d_2" },
    outputSchemaName: "Dashboard",
  });

  it("draws renderAgentResult's node in place of the result and structured output", () => {
    render(
      <ToolRenderersProvider
        renderAgentResult={(g) => (g.agentName === "visualizer" ? <div data-testid="app-result">{String(g.structuredOutput?.dashboard_id)}</div> : null)}
      >
        {withActivity({ v: finished }, <AgentCard groupId="v" group={finished} result="Dashboard d_2 is ready." />)}
      </ToolRenderersProvider>,
    );

    expect(screen.getByTestId("app-result").textContent).toBe("d_2");
    expect(screen.queryByText("Dashboard d_2 is ready.")).toBeNull();
    expect(screen.queryByText(/Structured output/)).toBeNull();
  });

  it("keeps the default result when renderAgentResult returns null", () => {
    render(
      <ToolRenderersProvider renderAgentResult={() => null}>
        {withActivity({ v: finished }, <AgentCard groupId="v" group={finished} result="Dashboard d_2 is ready." />)}
      </ToolRenderersProvider>,
    );

    expect(screen.getByText("Dashboard d_2 is ready.")).toBeInTheDocument();
    expect(screen.getByText(/Structured output/)).toBeInTheDocument();
  });

  it("renders the task, streamed text and result with the app's markdownRenderer", () => {
    render(
      <ToolRenderersProvider markdownRenderer={(text) => <span data-testid="app-markdown">{text}</span>}>
        {withActivity({ v: finished }, <AgentCard groupId="v" group={finished} result="Dashboard d_2 is ready." />)}
      </ToolRenderersProvider>,
    );

    expect(screen.getAllByTestId("app-markdown").map((node) => node.textContent)).toEqual([
      "Build the dashboard",
      "Building it",
      "Dashboard d_2 is ready.",
    ]);
  });
});
