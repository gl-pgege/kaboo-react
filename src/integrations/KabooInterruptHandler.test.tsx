import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import {
  InterruptBridgeProvider,
  useInterruptBridge,
} from "../context/InterruptBridge";
import type { InterruptRenderers } from "../context/InterruptRenderers";
import type { ActivityState, CustomRequestReason, InterruptRendererProps, StreamGroup, ToolCall } from "../types";

type RenderArgs = {
  interrupts: Array<Record<string, unknown>>;
  resolve: (payload: unknown, id: string) => void;
  cancel: (id: string) => void;
};

type RunStarted = (event: { agent: Record<string, unknown> }) => void;

const { captured } = vi.hoisted(() => ({
  captured: {
    render: null as null | ((a: RenderArgs) => ReactNode),
    onAgentRunStarted: null as null | RunStarted,
  },
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  useInterrupt: (opts: { render: (a: RenderArgs) => ReactNode }) => {
    captured.render = opts.render;
  },
  useCopilotKit: () => ({
    copilotkit: {
      subscribe: (subscriber: { onAgentRunStarted?: RunStarted }) => {
        captured.onAgentRunStarted = subscriber.onAgentRunStarted ?? null;
        return { unsubscribe: () => {} };
      },
    },
  }),
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

function approvalInterrupt(
  id: string,
  toolCallId?: string,
  extra: Record<string, unknown> = {},
) {
  return {
    id,
    metadata: { type: "approval", message: "Approve?", tool_name: "run_sql", ...extra },
    toolCallId,
  };
}

function continuationInterrupt(id: string) {
  return {
    id,
    reason: "continuation",
    metadata: { type: "continuation", message: "Continuing in a new response" },
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
  renderers,
}: {
  groups?: Record<string, StreamGroup>;
  args: RenderArgs;
  bridge?: boolean;
  renderers?: InterruptRenderers;
}) {
  const state: ActivityState = { groups };
  return (
    <ActivityContext.Provider value={state}>
      <InterruptBridgeProvider>
        <KabooInterruptHandler bridge={bridge} renderers={renderers} />
        <RenderCaptured args={args} />
        <BridgeProbe />
      </InterruptBridgeProvider>
    </ActivityContext.Provider>
  );
}

beforeEach(() => {
  captured.render = null;
  captured.onAgentRunStarted = null;
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
    expect(resolve).toHaveBeenCalledWith({ status: "approved", scope: "once" }, "i2");
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

  it("resumes a continuation at once, without prompting anyone", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [continuationInterrupt("c1")],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);

    expect(resolve).toHaveBeenCalledWith({ status: "continue" }, "c1");
    expect(screen.queryByText("Approve")).toBeNull();
    expect(screen.getByTestId("bridge-count").textContent).toBe("0");
  });

  it("resumes a continuation once, however often it re-renders", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [continuationInterrupt("c1")],
      resolve,
      cancel: vi.fn(),
    };
    const { rerender } = render(<Harness args={args} />);
    rerender(<Harness args={args} />);
    rerender(<Harness args={args} />);

    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("still prompts for a real gate opened alongside a continuation", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [continuationInterrupt("c1"), approvalInterrupt("i1")],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);

    expect(resolve).toHaveBeenCalledWith({ status: "continue" }, "c1");
    expect(screen.getAllByText("Approve")).toHaveLength(1);
    expect(screen.getByTestId("bridge-count").textContent).toBe("1");
  });

  it("recognises a continuation by its top-level reason too", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [{ id: "c1", reason: "continuation" }],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);

    expect(resolve).toHaveBeenCalledWith({ status: "continue" }, "c1");
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

  it("approves every waiting approval at once with Approve all", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [approvalInterrupt("i1"), approvalInterrupt("i2")],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);

    fireEvent.click(screen.getByText("Approve all"));

    expect(resolve).toHaveBeenCalledWith({ status: "approved", scope: "once" }, "i1");
    expect(resolve).toHaveBeenCalledWith({ status: "approved", scope: "once" }, "i2");
    expect(screen.queryByText("Approve all")).toBeNull();
    expect(screen.getAllByText("Response submitted")).toHaveLength(2);
  });

  it("denies every waiting approval with Deny all, as cancellations", () => {
    const resolve = vi.fn();
    const args: RenderArgs = {
      interrupts: [approvalInterrupt("i1"), approvalInterrupt("i2")],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);

    fireEvent.click(screen.getByText("Deny all"));

    expect(resolve).toHaveBeenCalledWith({ status: "cancelled" }, "i1");
    expect(resolve).toHaveBeenCalledWith({ status: "cancelled" }, "i2");
  });

  it("offers no batch actions for a single approval", () => {
    const args: RenderArgs = {
      interrupts: [approvalInterrupt("i1")],
      resolve: vi.fn(),
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);
    expect(screen.queryByText("Approve all")).toBeNull();
  });

  it("lets 'Allow for this chat' approve the other waiting requests it covers", () => {
    const resolve = vi.fn();
    const scoped = { scopes: ["once", "thread"], subject: { key: "run_sql", label: "Run SQL" } };
    const args: RenderArgs = {
      interrupts: [
        approvalInterrupt("i1", undefined, scoped),
        approvalInterrupt("i2", undefined, scoped),
        approvalInterrupt("i3", undefined, { ...scoped, tool_name: "drop_table" }),
      ],
      resolve,
      cancel: vi.fn(),
    };
    render(<Harness args={args} />);

    fireEvent.click(screen.getAllByText("Allow for this chat")[0]);

    expect(resolve).toHaveBeenCalledWith({ status: "approved", scope: "thread" }, "i1");
    expect(resolve).toHaveBeenCalledWith({ status: "approved", scope: "once" }, "i2");
    expect(resolve).not.toHaveBeenCalledWith(expect.anything(), "i3");
  });

  it("renders an app's own request kind with its registered renderer", () => {
    function FilesCard({ reason }: InterruptRendererProps<CustomRequestReason>) {
      return <div>Upload: {String(reason.message)}</div>;
    }
    const args: RenderArgs = {
      interrupts: [{ id: "f1", metadata: { type: "files", message: "the Q3 workbook" } }],
      resolve: vi.fn(),
      cancel: vi.fn(),
    };
    render(<Harness args={args} renderers={{ files: FilesCard }} />);
    expect(screen.getByText("Upload: the Q3 workbook")).toBeTruthy();
  });

  it("falls back to a card with Skip for a kind nothing renders, so the chat never stalls", () => {
    const cancel = vi.fn();
    const args: RenderArgs = {
      interrupts: [{ id: "f1", metadata: { type: "files", message: "Upload the Q3 workbook" } }],
      resolve: vi.fn(),
      cancel,
    };
    render(<Harness args={args} />);

    expect(screen.getByText("Upload the Q3 workbook")).toBeTruthy();
    fireEvent.click(screen.getByText("Skip"));
    expect(cancel).toHaveBeenCalledWith("f1");
  });

  it("drops what waits when a message is sent, so the run can start", () => {
    render(<Harness args={{ interrupts: [], resolve: vi.fn(), cancel: vi.fn() }} />);
    const sent = { agentId: "a", pendingInterrupts: [{ id: "i1" }], messages: [{ role: "user" }] };
    const resumed = { agentId: "a", pendingInterrupts: [{ id: "i1" }], messages: [{ role: "tool" }] };

    captured.onAgentRunStarted?.({ agent: sent });
    captured.onAgentRunStarted?.({ agent: resumed });

    expect(sent.pendingInterrupts).toEqual([]);
    expect(resumed.pendingInterrupts).toEqual([{ id: "i1" }]);
  });
});
