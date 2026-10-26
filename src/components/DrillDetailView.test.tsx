import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import { DrillContext } from "../context/DrillContext";
import { ToolRenderersProvider } from "../context/ToolRenderers";
import type {
  ActivityState,
  DrillState,
  StreamGroup,
} from "../types";
import { DrillDetailView } from "./DrillDetailView";

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

const NOOP = () => {};

function harness(
  groups: Record<string, StreamGroup>,
  activeDrill: string,
  node: ReactNode,
) {
  const activity: ActivityState = { groups };
  const drill: DrillState = {
    drillPath: [activeDrill],
    activeDrill,
    drillIn: NOOP,
    drillUp: NOOP,
    drillToRoot: NOOP,
    drillToLevel: NOOP,
  };
  return (
    <ActivityContext.Provider value={activity}>
      <DrillContext.Provider value={drill}>
        {node}
      </DrillContext.Provider>
    </ActivityContext.Provider>
  );
}

describe("DrillDetailView token usage breakdown", () => {
  it("shows the in/out/total breakdown when the group has usage", () => {
    const g = group({
      status: "completed",
      usage: { inputTokens: 48_200, outputTokens: 3_100, totalTokens: 51_300 },
    });
    render(harness({ main: g }, "main", <DrillDetailView />));

    expect(screen.getByText("48.2k")).toBeInTheDocument();
    expect(screen.getByText("3.1k")).toBeInTheDocument();
    expect(screen.getByText("51.3k")).toBeInTheDocument();
    expect(screen.getByText("total tokens")).toBeInTheDocument();
  });

  it("renders no breakdown without usage", () => {
    const g = group({ status: "completed" });
    render(harness({ main: g }, "main", <DrillDetailView />));
    expect(screen.queryByText("total tokens")).toBeNull();
  });
});

describe("DrillDetailView task and result", () => {
  it("shows a JSON handoff's text as markdown, and the app's result after the timeline", () => {
    const g = group({
      status: "completed",
      task: JSON.stringify({ request: "Find **churn** drivers", dashboard_title: "Churn" }),
      timeline: [{ type: "text", text: "Looked at churn" }],
    });
    const { container } = render(
      <ToolRenderersProvider renderAgentResult={(grp) => <div data-testid="app-result">{grp.status}</div>}>
        {harness({ main: g }, "main", <DrillDetailView />)}
      </ToolRenderersProvider>,
    );

    expect(container.querySelector(".kaboo-drill-task .kaboo-agent-card-task-text")?.textContent?.trim()).toBe(
      "Find churn drivers",
    );
    expect(screen.getByTestId("app-result").textContent).toBe("completed");
    const text = container.textContent ?? "";
    expect(text.indexOf("Looked at churn")).toBeLessThan(text.indexOf("completed"));
  });
});

