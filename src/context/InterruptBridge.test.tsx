import { describe, it, expect, vi } from "vitest";
import { render, act } from "@testing-library/react";
import {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
  useInterruptBridge,
  useInterruptFor,
  type ActiveInterrupt,
} from "./InterruptBridge";
import type { InterruptReason } from "../types";

const approval: InterruptReason = {
  type: "approval",
  message: "ok?",
  tool_name: "run_sql",
};

function bridge(id: string, toolCallId?: string): ActiveInterrupt {
  return {
    id,
    reason: approval,
    toolCallId,
    onResolve: () => {},
    onCancel: () => {},
  };
}

describe("InterruptBridge", () => {
  it("publish replaces the active set", () => {
    let ctx: ReturnType<typeof useInterruptBridge>;
    function Probe() {
      ctx = useInterruptBridge();
      return <div data-testid="n">{ctx.active.length}</div>;
    }
    render(
      <InterruptBridgeProvider>
        <Probe />
      </InterruptBridgeProvider>,
    );
    expect(ctx!.active).toHaveLength(0);
    act(() => ctx!.publish([bridge("a"), bridge("b")]));
    expect(ctx!.active.map((i) => i.id)).toEqual(["a", "b"]);
  });

  it("useInterruptFor returns the matching interrupt, or undefined", () => {
    let ctx: ReturnType<typeof useInterruptBridge>;
    let forT1: ActiveInterrupt | undefined;
    let forMissing: ActiveInterrupt | undefined;
    let forNoId: ActiveInterrupt | undefined;
    function Probe() {
      ctx = useInterruptBridge();
      forT1 = useInterruptFor("t1");
      forMissing = useInterruptFor("nope");
      forNoId = useInterruptFor(undefined);
      return null;
    }
    render(
      <InterruptBridgeProvider>
        <Probe />
      </InterruptBridgeProvider>,
    );
    act(() => ctx!.publish([bridge("a", "t1")]));
    expect(forT1?.id).toBe("a");
    expect(forMissing).toBeUndefined();
    expect(forNoId).toBeUndefined();
  });

  it("InterruptBridgePublisher publishes on mount and clears on unmount", () => {
    let ctx: ReturnType<typeof useInterruptBridge>;
    function Probe() {
      ctx = useInterruptBridge();
      return null;
    }
    const { rerender } = render(
      <InterruptBridgeProvider>
        <InterruptBridgePublisher interrupts={[bridge("a"), bridge("b")]} />
        <Probe />
      </InterruptBridgeProvider>,
    );
    expect(ctx!.active.map((i) => i.id)).toEqual(["a", "b"]);

    rerender(
      <InterruptBridgeProvider>
        <Probe />
      </InterruptBridgeProvider>,
    );
    expect(ctx!.active).toHaveLength(0);
  });

  it("proxies resolve/cancel to the latest ref callbacks", () => {
    let ctx: ReturnType<typeof useInterruptBridge>;
    function Probe() {
      ctx = useInterruptBridge();
      return null;
    }
    const onResolve = vi.fn();
    const onCancel = vi.fn();
    const list: ActiveInterrupt[] = [
      { id: "a", reason: approval, onResolve, onCancel },
    ];
    render(
      <InterruptBridgeProvider>
        <InterruptBridgePublisher interrupts={list} />
        <Probe />
      </InterruptBridgeProvider>,
    );
    act(() => ctx!.active[0].onResolve({ status: "approved" }));
    expect(onResolve).toHaveBeenCalledWith({ status: "approved" });
    act(() => ctx!.active[0].onCancel());
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
