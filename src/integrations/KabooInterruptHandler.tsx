import type { ReactElement } from "react";
import { useInterrupt } from "@copilotkit/react-core/v2";
import { InterruptRenderer } from "../components/InterruptRenderer";
import {
  InterruptBridgePublisher,
  type ActiveInterrupt,
} from "../context/InterruptBridge";
import { useActivity } from "../hooks/useActivity";
import { pendingToolAnchorExists } from "../utils/groups";
import { KabooAskUser } from "./KabooAskUser";
import type { InterruptReason, InterruptRendererProps } from "../types";

/**
 * Chat-level fallback slot for one interrupt. Renders the prompt UI unless the
 * owning agent card already renders it inline at its pending tool-call position
 * (see {@link pendingToolAnchorExists}) — in that case this returns nothing so
 * the prompt stays in chronological order inside the card instead of floating on
 * top of the turn's cards. Prompts with no on-screen tool anchor render here.
 */
function ChatInterruptSlot({
  interrupt,
  Renderer,
}: {
  interrupt: ActiveInterrupt;
  Renderer: React.ComponentType<InterruptRendererProps>;
}): ReactElement | null {
  const { groups } = useActivity();
  if (pendingToolAnchorExists(groups, interrupt.toolCallId)) {
    return null;
  }
  return (
    <Renderer
      reason={interrupt.reason}
      toolCallId={interrupt.toolCallId}
      onResolve={interrupt.onResolve}
      onCancel={interrupt.onCancel}
    />
  );
}

export interface KabooInterruptHandlerProps {
  /** Restrict handling to a single CopilotKit agent (optional). */
  agentId?: string;
  /** Per-interrupt-type renderer overrides. */
  renderers?: Partial<
    Record<InterruptReason["type"], React.ComponentType<InterruptRendererProps>>
  >;
  /**
   * Also publish the active interrupts to the InterruptBridge so each renders
   * inside the drill-down detail view (not just the chat). Defaults to `true`;
   * requires an `InterruptBridgeProvider` (included in `KabooProvider`).
   */
  bridge?: boolean;
}

/**
 * Ready-made human-in-the-loop interrupt handler. CopilotKit surfaces every open
 * interrupt of a run at once (e.g. two gated tools called in parallel); we render
 * one card per interrupt and resolve each independently by its own id. The client
 * accumulates the per-id responses and only resumes the run once every open
 * interrupt has been answered — so resolving with `intr.id` (never the bare
 * `resolve()`, which would only ever answer the first) is what keeps N parallel
 * gates from wedging. Prompts anchored to an on-screen tool render inline at that
 * tool's position; the rest fall back to the chat slot.
 */
export function KabooInterruptHandler({
  agentId,
  renderers,
  bridge = true,
}: KabooInterruptHandlerProps): ReactElement | null {
  useInterrupt({
    ...(agentId ? { agentId } : {}),
    render: ({ interrupts, resolve, cancel }) => {
      const active: ActiveInterrupt[] = (interrupts ?? [])
        .map((intr): ActiveInterrupt | null => {
          const reason = (intr?.metadata ?? intr?.reason) as
            | InterruptReason
            | undefined;
          if (!reason || !reason.type) return null;
          return {
            id: intr.id,
            reason,
            toolCallId: (intr as { toolCallId?: string }).toolCallId,
            onResolve: (payload: unknown) => resolve(payload, intr.id),
            onCancel: () => cancel(intr.id),
          };
        })
        .filter((x): x is ActiveInterrupt => x !== null);

      if (active.length === 0) {
        return <></>;
      }

      return (
        <>
          {bridge && <InterruptBridgePublisher interrupts={active} />}
          {active.map((a) => (
            <ChatInterruptSlot
              key={a.id}
              interrupt={a}
              Renderer={renderers?.[a.reason.type] ?? InterruptRenderer}
            />
          ))}
        </>
      );
    },
  });

  return <KabooAskUser agentId={agentId} />;
}
