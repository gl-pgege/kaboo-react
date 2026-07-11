import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import {
  InterruptBridgeProvider,
  useInterruptBridge,
} from "../context/InterruptBridge";
import type { ActivityState, StreamGroup, ToolCall } from "../types";

type RenderArgs = {
  interrupts: Array<Record<string, unknown>>;
  resolve: (payload: unknown, id: string) => void;
  cancel: (id: string) => void;
};

const { captured } = vi.hoisted(() => ({
  captured: { render: null as null | ((a: RenderArgs) => ReactNode) },
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  useInterrupt: (opts: { render: (a: RenderArgs) => ReactNode }) => {
    captured.render = opts.render;
  },
}));

vi.mock("./KabooAskUser", () => ({ KabooAskUser: () => null }));

import { KabooInterruptHandler } from "./KabooInterruptHandler";

function group(overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: "g",
    agentName: "agent",
    parentGroup: null,
    status: "active",
    tools: [],
    tokens: "",
    timeline: [],
    ...overrides,
  };
}

function tool(overrides: Partial<ToolCall> = {}): ToolCall {
  return { toolUseId: "t1", toolName: "run_sql", status: "running", ...overrides };
}

function approvalInterrupt(id: string, toolCallId?: string) {
  return {
    id,
    metadata: { type: "approval", message: "Approve?", tool_name: "run_sql" },
    toolCallId,
  };
}

function BridgeProbe() {
  const { active } = useInterruptBridge();
  return <div data-testid="bridge-count">{active.length}</div>;
}

function RenderCaptured({ args }: { args: RenderArgs }) {
  return <>{captured.render?.(args)}</>;
}

function Harness({
  groups = {},
  args,
  bridge = true,
}: {
  groups?: Record<string, StreamGroup>;
  args: RenderArgs;
  bridge?: boolean;
}) {
  const state: ActivityState = { groups };
  return (
    <ActivityContext.Provider value={state}>
      <InterruptBridgeProvider>
        <KabooInterruptHandler bridge={bridge} />
        <RenderCaptured args={args} />
        <BridgeProbe />
      </InterruptBridgeProvider>
    </ActivityContext.Provider>
  );
}

beforeEach(() => {
  captured.render = null;
});

describe("KabooInterruptHandler", () => {
  it("renders one card per open interrupt", () => {
    const args: RenderArgs = {
      interrupts: [approvalInterrupt("i1"), approvalInterrupt("i2")],
      resolve: vi.fn(),
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);
    expect(screen.getAllByText("Approve")).toHaveLength(2);
  });

  it("resolves each interrupt independently by its own id", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [approvalInterrupt("i1"), approvalInterrupt("i2")],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);
    fireEvent.click(screen.getAllByText("Approve")[1]);
    expect(resolve).toHaveBeenCalledWith({ status: "approved" }, "i2");
  });

  it("suppresses the chat-slot card when anchored to an on-screen pending tool", () => {
    const groups = {
      g1: group({ status: "interrupted", tools: [tool({ toolUseId: "t1" })] }),
    };
    const args: RenderArgs = {
      interrupts: [approvalInterrupt("i1", "t1")],
      resolve: vi.fn(),
      cancel: vi.fn(),
    };
    render(<Harness groups={groups} args={args} />);
    expect(screen.queryByText("Approve")).toBeNull();
  });

  it("publishes to the bridge only when enabled", () => {
    const args = (): RenderArgs => ({
      interrupts: [approvalInterrupt("i1"), approvalInterrupt("i2")],
      resolve: vi.fn(),
      cancel: vi.fn(),
    });
    const { unmount } = render(<Harness args={args()} bridge />);
    expect(screen.getByTestId("bridge-count").textContent).toBe("2");
    unmount();

    render(<Harness args={args()} bridge={false} />);
    expect(screen.getByTestId("bridge-count").textContent).toBe("0");
  });
});
