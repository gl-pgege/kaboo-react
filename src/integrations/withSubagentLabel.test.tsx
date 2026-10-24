import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactActivityMessageRenderer } from "@copilotkit/react-core/v2";
import { ActivityContext } from "../context/ActivityProvider";
import type { StreamGroup } from "../types";
import { withSubagentLabel } from "./withSubagentLabel";

const analyst: StreamGroup = {
  title: "Analyzing the data",
  agentName: "analyst",
  parentGroup: null,
  toolCallId: "delegate-1",
  status: "completed",
  tools: [{ toolUseId: "query-1", toolName: "sql-workbench___create_queries", status: "success" }],
  timeline: [],
};

const surface = withSubagentLabel({
  activityType: "a2ui-surface",
  content: { "~standard": { version: 1, vendor: "test", validate: (value: unknown) => ({ value }) } },
  render: () => <div>the surface</div>,
} as ReactActivityMessageRenderer<unknown>);

function show(messageId: string) {
  const Render = surface.render;
  render(
    <ActivityContext.Provider value={{ groups: { analyst } }}>
      <Render activityType="a2ui-surface" content={{}} message={{ id: messageId, role: "activity", activityType: "a2ui-surface", content: {} }} agent={undefined} />
    </ActivityContext.Provider>,
  );
}

describe("withSubagentLabel", () => {
  it("labels a surface a sub-agent rendered after one of its own calls", () => {
    show("a2ui-surface-query-1");
    expect(screen.getByText("Analyzing the data")).toBeInTheDocument();
    expect(screen.getByText("the surface")).toBeInTheDocument();
  });

  it("leaves a surface from the agent answering the chat unlabelled", () => {
    show("a2ui-surface-main-call");
    expect(screen.queryByText("Analyzing the data")).toBeNull();
    expect(screen.getByText("the surface")).toBeInTheDocument();
  });
});
