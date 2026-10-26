import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState, StreamGroup } from "../types";

type ToolRenderProps = {
  name: string;
  toolCallId: string;
  parameters: unknown;
  status: "inProgress" | "executing" | "complete";
  result?: unknown;
};

const { captured } = vi.hoisted(() => ({
  captured: {
    render: null as null | ((p: ToolRenderProps) => ReactNode),
  },
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  useDefaultRenderTool: (opts: { render: (p: ToolRenderProps) => ReactNode }) => {
    captured.render = opts.render;
  },
}));

import { KabooToolRender } from "./KabooToolRender";
import { ToolRenderersProvider } from "../context/ToolRenderers";

function RenderCaptured({ props }: { props: ToolRenderProps }) {
  return <>{captured.render?.(props)}</>;
}

function Harness({
  groups = {},
  toolProps,
}: {
  groups?: Record<string, StreamGroup>;
  toolProps: ToolRenderProps;
}) {
  const state: ActivityState = { groups };
  return (
    <ActivityContext.Provider value={state}>
      <KabooToolRender />
      <RenderCaptured props={toolProps} />
    </ActivityContext.Provider>
  );
}

const pendingCall: ToolRenderProps = {
  name: "create_work_item",
  toolCallId: "call-1",
  parameters: { title: "Testing Investigation" },
  status: "inProgress",
};

beforeEach(() => {
  captured.render = null;
});

describe("KabooToolRender", () => {
  it("renders a plain tool call as a row in the transcript", () => {
    render(<Harness toolProps={pendingCall} />);
    expect(screen.getByText(/create_work_item|Create work item/i)).toBeTruthy();
  });

  it("leaves a call that started a sub-agent to its card", () => {
    const groups: Record<string, StreamGroup> = {
      "main.builder": {
        title: "Building",
        agentName: "builder",
        parentGroup: null,
        status: "active",
        tools: [],
        tokens: "",
        timeline: [],
        toolCallId: "call-1",
      },
    };
    const { container } = render(<Harness groups={groups} toolProps={pendingCall} />);
    expect(container.querySelector(".kaboo-inline-tool")).toBeNull();
  });

  it("draws an unknown tool with the app's fallback renderer instead of the built-in row", () => {
    const { container } = render(
      <ToolRenderersProvider
        fallbackToolRenderer={({ tool }) => <div data-testid="app-fallback">{`${tool.toolName}:${tool.status}`}</div>}
      >
        <Harness toolProps={{ ...pendingCall, status: "complete", result: "created" }} />
      </ToolRenderersProvider>,
    );
    expect(screen.getByTestId("app-fallback").textContent).toBe("create_work_item:success");
    expect(container.querySelector(".kaboo-tool-row")).toBeNull();
  });
});
