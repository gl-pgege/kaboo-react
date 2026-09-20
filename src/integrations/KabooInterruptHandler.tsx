import { useEffect, useRef, type ReactElement } from "react";
import { useInterrupt } from "@copilotkit/react-core/v2";
import {
  InterruptBridgePublisher,
  type ActiveInterrupt,
} from "../context/InterruptBridge";
import { useInterruptRenderer } from "../context/InterruptRenderers";
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
  Renderer: RendererOverride,
}: {
  interrupt: ActiveInterrupt;
  Renderer?: React.ComponentType<InterruptRendererProps>;
}): ReactElement | null {
  const { groups } = useActivity();
  const ContextRenderer = useInterruptRenderer(interrupt.reason.type);
  const Renderer = RendererOverride ?? ContextRenderer;
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

/**
 * The interrupt type a run raises when it has filled its response budget and
 * stopped at a tool boundary. It asks nothing of the user, so it must never
 * reach a renderer — see {@link ContinuationResolver}.
 */
const CONTINUATION = "continuation";

/**
 * Resumes continuation pauses the moment they arrive, rendering nothing.
 *
 * A run too large for one HTTP response pauses part-way and waits to be
 * resumed, using the same interrupt machinery as a human approval. Nobody has
 * to answer this one, so answering it here is what turns a hard limit into a
 * seam the user never sees: the turn keeps its id, its cards stay active, and
 * the work continues in the next response.
 *
 * Each id is resolved once. CopilotKit re-renders while the resume is in
 * flight, and resolving twice would reply to an interrupt that is no longer
 * open.
 */
function ContinuationResolver({
  ids,
  resolve,
}: {
  ids: string[];
  resolve: (payload: unknown, id: string) => void;
}): null {
  const resolved = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const id of ids) {
      if (resolved.current.has(id)) continue;
      resolved.current.add(id);
      resolve({ status: "continue" }, id);
    }
  });
  return null;
}

/** Props for {@link KabooInterruptHandler}. */
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
      const open = interrupts ?? [];
      const continuations = open
        .filter((intr) => {
          const meta = intr?.metadata as { type?: string } | undefined;
          return meta?.type === CONTINUATION || intr?.reason === CONTINUATION;
        })
        .map((intr) => intr.id);

      const active: ActiveInterrupt[] = open
        .map((intr): ActiveInterrupt | null => {
          if (continuations.includes(intr.id)) return null;
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

      const resumer = continuations.length > 0 && (
        <ContinuationResolver ids={continuations} resolve={resolve} />
      );

      if (active.length === 0) {
        return <>{resumer}</>;
      }

      return (
        <>
          {resumer}
          {bridge && <InterruptBridgePublisher interrupts={active} />}
          {active.map((a) => (
            <ChatInterruptSlot
              key={a.id}
              interrupt={a}
              Renderer={renderers?.[a.reason.type]}
            />
          ))}
        </>
      );
    },
  });

  return <KabooAskUser agentId={agentId} />;
}
