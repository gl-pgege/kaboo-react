import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
  type ActiveInterrupt,
} from "../context/InterruptBridge";
import { InterruptRenderersProvider } from "../context/InterruptRenderers";
import type { ActivityState, InterruptRendererProps, StreamGroup } from "../types";

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

function RenderCaptured({ props }: { props: ToolRenderProps }) {
  return <>{captured.render?.(props)}</>;
}

function approvalInterrupt(toolCallId: string): ActiveInterrupt {
  return {
    id: `i-${toolCallId}`,
    reason: {
      type: "approval",
      message: "Agent wants to call create_work_item",
      tool_name: "create_work_item",
    },
    toolCallId,
    onResolve: () => {},
    onCancel: () => {},
  };
}

function Harness({
  groups = {},
  interrupts = [],
  toolProps,
  renderers,
}: {
  groups?: Record<string, StreamGroup>;
  interrupts?: ActiveInterrupt[];
  toolProps: ToolRenderProps;
  renderers?: Partial<
    Record<"approval" | "form", React.ComponentType<InterruptRendererProps>>
  >;
}) {
  const state: ActivityState = { groups };
  return (
    <ActivityContext.Provider value={state}>
      <InterruptBridgeProvider>
        <InterruptRenderersProvider renderers={renderers}>
          <InterruptBridgePublisher interrupts={interrupts} />
          <KabooToolRender />
          <RenderCaptured props={toolProps} />
        </InterruptRenderersProvider>
      </InterruptBridgeProvider>
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

describe("KabooToolRender inline gate", () => {
  it("renders the approval gate under the wildcard tool row when an interrupt anchors to it", () => {
    render(<Harness interrupts={[approvalInterrupt("call-1")]} toolProps={pendingCall} />);

    // Host-rendered tool row (plain agent, no AgentCard timeline) still gets
    // its live gate — this is the only surface for it, since the chat-level
    // slot defers to the tool anchor.
    expect(screen.getByText("Agent wants to call create_work_item")).toBeInTheDocument();
    expect(screen.getByText("Approve")).toBeInTheDocument();
  });

  it("renders no gate when no interrupt anchors to the tool call", () => {
    render(<Harness interrupts={[approvalInterrupt("other-call")]} toolProps={pendingCall} />);
    expect(screen.queryByText("Approve")).toBeNull();
  });

  it("uses the app's interruptRenderers override for the anchored gate", () => {
    const Custom = ({ reason }: InterruptRendererProps) => (
      <div data-testid="custom-gate">{reason.type === "approval" ? reason.message : ""}</div>
    );
    render(
      <Harness
        interrupts={[approvalInterrupt("call-1")]}
        toolProps={pendingCall}
        renderers={{ approval: Custom }}
      />,
    );

    expect(screen.getByTestId("custom-gate").textContent).toBe(
      "Agent wants to call create_work_item",
    );
    expect(screen.queryByText("Approve")).toBeNull();
  });
});
