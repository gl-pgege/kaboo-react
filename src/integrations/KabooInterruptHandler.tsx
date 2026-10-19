import { useCallback, useEffect, useRef, type ReactElement } from "react";
import { useAgent, useCopilotKit, useInterrupt } from "@copilotkit/react-core/v2";
import {
  InterruptBridgePublisher,
  useInterruptBridge,
  type ActiveInterrupt,
} from "../context/InterruptBridge";
import type { InterruptRenderers } from "../context/InterruptRenderers";
import { InterruptPrompt } from "../components/InterruptPrompt";
import { useActivity } from "../hooks/useActivity";
import { pendingToolAnchorExists } from "../utils/groups";
import { KabooAskUser } from "./KabooAskUser";
import type {
  ApprovalDecision,
  ApprovalReason,
  CustomRequestReason,
  InterruptReason,
  InterruptRendererProps,
} from "../types";

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
  Renderer?: React.ComponentType<InterruptRendererProps<any>>;
}): ReactElement | null {
  const { groups } = useActivity();
  if (pendingToolAnchorExists(groups, interrupt.toolCallId)) {
    return null;
  }
  return <InterruptPrompt interrupt={interrupt} Renderer={Renderer} />;
}

/**
 * Why the last answers never reached the agent, above the requests that came
 * back. Reads the bridge, so it updates while the interrupt element stays
 * mounted.
 */
function InterruptFailure(): ReactElement | null {
  const { failure } = useInterruptBridge();
  if (!failure) return null;
  return (
    <p className="kaboo-interrupt-error" role="alert">
      {failure}
    </p>
  );
}

function isExpired(reason: ApprovalReason): boolean {
  const deadline = reason.expiresAt ? Date.parse(reason.expiresAt) : NaN;
  return Number.isFinite(deadline) && deadline <= Date.now();
}

/**
 * "Approve all" / "Deny all" for two or more approvals waiting at once. Expired
 * requests are dismissed rather than approved. Reads what was already answered
 * from the bridge, since CopilotKit keeps the rendered interrupt element until
 * the set of open interrupts changes.
 */
function ApprovalBatchBar({ approvals }: { approvals: ActiveInterrupt[] }): ReactElement | null {
  const { answered } = useInterruptBridge();
  const waiting = approvals.filter((a) => !answered.has(a.id));
  if (waiting.length < 2) return null;
  const approveAll = () => {
    for (const a of waiting) {
      if (isExpired(a.reason as ApprovalReason)) a.onCancel();
      else a.onResolve({ status: "approved", scope: "once" } satisfies ApprovalDecision);
    }
  };
  const denyAll = () => {
    for (const a of waiting) a.onResolve({ status: "cancelled" } satisfies ApprovalDecision);
  };
  return (
    <div className="kaboo-approval-batch" role="group" aria-label="Waiting approvals">
      <span className="kaboo-approval-batch-count">{waiting.length} approvals waiting</span>
      <div className="kaboo-interrupt-actions">
        <button className="kaboo-interrupt-btn kaboo-interrupt-btn-approve" onClick={approveAll}>
          Approve all
        </button>
        <button className="kaboo-interrupt-btn kaboo-interrupt-btn-reject" onClick={denyAll}>
          Deny all
        </button>
      </div>
    </div>
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

type RunningAgent = NonNullable<ReturnType<typeof useAgent>["agent"]>;

/**
 * Drop the tool messages CopilotKit adds, carrying the person's answer, for
 * each tool call an answered request resumes. They would show as the call's
 * result until the agent sends the real one, and the agent never sees a call
 * whose request was skipped or never reached it.
 */
function dropAnswerMessages(agent: RunningAgent): void {
  const resumed = new Set(
    (agent.pendingInterrupts ?? []).filter((i) => i.reason === "tool_call" && i.toolCallId).map((i) => i.toolCallId),
  );
  if (resumed.size === 0) return;
  const messages = agent.messages.filter((m) => !(m.role === "tool" && resumed.has(m.toolCallId)));
  if (messages.length !== agent.messages.length) agent.setMessages(messages);
}

/**
 * Sending a message while a question or approval waits skips it: the person
 * moved on. The AG-UI client refuses to start a run until every open request
 * is answered, so the stale requests are dropped from the agent just before
 * the run starts; the run then carries the new message as a fresh turn, and
 * the agent closes what it was waiting on as skipped.
 *
 * Answering them resumes the run instead. Either way the answer messages
 * CopilotKit added are dropped (see `dropAnswerMessages`).
 */
function useSkipOnSend(agentId: string | undefined, onSkip: () => void): void {
  const { copilotkit } = useCopilotKit();
  const onSkipRef = useRef(onSkip);
  onSkipRef.current = onSkip;
  useEffect(() => {
    const subscription = copilotkit.subscribe({
      onAgentRunStarted: ({ agent }) => {
        if (agentId && agent.agentId !== agentId) return;
        if (!agent.pendingInterrupts || agent.pendingInterrupts.length === 0) return;
        dropAnswerMessages(agent);
        if (agent.messages[agent.messages.length - 1]?.role === "user") {
          agent.pendingInterrupts = [];
          onSkipRef.current();
        }
      },
    });
    return () => subscription.unsubscribe();
  }, [copilotkit, agentId]);
}

/** Whether a run carries answers a person gave, as opposed to automatic continuations. */
function answers(input: unknown): boolean {
  const resume = (input as { resume?: Array<{ payload?: unknown }> } | undefined)?.resume;
  if (!Array.isArray(resume) || resume.length === 0) return false;
  return resume.some((entry) => (entry.payload as { status?: unknown } | undefined)?.status !== "continue");
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && (error.name === "AbortError" || /aborted/i.test(error.message));
}

function sendFailure(error: unknown): string {
  const reason = error instanceof Error ? error.message : String(error);
  return reason ? `Your answer couldn't be sent: ${reason}` : "Your answer couldn't be sent.";
}

/**
 * Reports answers that never reached the agent: a run resuming with a
 * person's answers that ends in `RUN_ERROR`, or fails, before the agent did
 * anything, such as when the host refuses a decision. The requests are still
 * open on the server, so they can be answered again.
 */
function useFailedAnswers(agentId: string | undefined, onFailed: (message: string) => void): void {
  const { agent } = useAgent({ ...(agentId ? { agentId } : {}), updates: [] });
  const onFailedRef = useRef(onFailed);
  onFailedRef.current = onFailed;
  useEffect(() => {
    if (!agent) return;
    let answering = false;
    let progressed = false;
    let failure: string | null = null;
    const subscription = agent.subscribe({
      onRunInitialized: ({ input }) => {
        answering = answers(input);
        progressed = false;
        failure = null;
      },
      onEvent: ({ event }) => {
        const type = String(event.type);
        if (type !== "RUN_STARTED" && type !== "RUN_ERROR") progressed = true;
      },
      onRunErrorEvent: ({ event }) => {
        if (answering && !progressed) failure = event.message || "Your answer couldn't be recorded.";
      },
      onRunFailed: ({ error }) => {
        if (answering && !progressed && !isAbort(error)) failure = sendFailure(error);
      },
      onRunFinalized: () => {
        answering = false;
        if (failure === null) return;
        const message = failure;
        failure = null;
        onFailedRef.current(message);
      },
    });
    return () => subscription.unsubscribe();
  }, [agent]);
}

/** Props for {@link KabooInterruptHandler}. */
export interface KabooInterruptHandlerProps {
  /** Restrict handling to a single CopilotKit agent (optional). */
  agentId?: string;
  /** Renderer overrides keyed by request kind (`approval`, `form`, or an app's own). */
  renderers?: InterruptRenderers;
  /**
   * Also publish the active interrupts to the InterruptBridge so each renders
   * inside the drill-down detail view (not just the chat). Defaults to `true`;
   * requires an `InterruptBridgeProvider` (included in `KabooProvider`).
   */
  bridge?: boolean;
  /**
   * Called with the reason when an answer never reached the agent (the host
   * refused it, or it couldn't be sent). The requests come back to be
   * answered again either way; use this to show the reason elsewhere too,
   * such as a toast.
   */
  onInterruptError?: (message: string) => void;
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
 *
 * Two or more approvals waiting at once get "Approve all" and "Deny all". A
 * message sent while anything waits skips it, so the chat is never stuck.
 *
 * When answers never reach the agent (the host refuses a decision, or the
 * request fails), the requests come back to be answered again, with the reason
 * above them and passed to `onInterruptError`.
 *
 * @example
 * ```tsx
 * import { CopilotKit } from "@copilotkit/react-core/v2";
 * import { InterruptBridgeProvider } from "@pgege/kaboo-react";
 * import { KabooInterruptHandler } from "@pgege/kaboo-react/copilotkit";
 *
 * function Hitl({ children }: { children: React.ReactNode }) {
 *   return (
 *     <CopilotKit runtimeUrl="/api/copilotkit" agent="assistant">
 *       <InterruptBridgeProvider>
 *         <KabooInterruptHandler agentId="assistant" />
 *         {children}
 *       </InterruptBridgeProvider>
 *     </CopilotKit>
 *   );
 * }
 * ```
 */
export function KabooInterruptHandler({
  agentId,
  renderers,
  bridge = true,
  onInterruptError,
}: KabooInterruptHandlerProps): ReactElement | null {
  const { markAnswered, clearAnswered, setFailure } = useInterruptBridge();
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ ...(agentId ? { agentId } : {}), updates: [] });
  const onInterruptErrorRef = useRef(onInterruptError);
  onInterruptErrorRef.current = onInterruptError;
  const recovering = useRef(false);

  const recover = useCallback(
    (message: string) => {
      if (recovering.current) return;
      recovering.current = true;
      setFailure(message);
      onInterruptErrorRef.current?.(message);
      clearAnswered();
      if (!agent) {
        recovering.current = false;
        return;
      }
      dropAnswerMessages(agent);
      void Promise.resolve(copilotkit.connectAgent({ agent }))
        .catch(() => undefined)
        .finally(() => {
          recovering.current = false;
        });
    },
    [agent, copilotkit, clearAnswered, setFailure],
  );

  useSkipOnSend(agentId, () => setFailure(null));
  useFailedAnswers(agentId, recover);

  const settle = (pending: unknown) => {
    void Promise.resolve(pending).catch((error: unknown) => {
      if (!isAbort(error)) recover(sendFailure(error));
    });
  };

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
            | CustomRequestReason
            | undefined;
          if (!reason || !reason.type) return null;
          return {
            id: intr.id,
            reason,
            toolCallId: (intr as { toolCallId?: string }).toolCallId,
            onResolve: (payload: unknown) => {
              markAnswered(intr.id);
              setFailure(null);
              settle(resolve(payload, intr.id));
            },
            onCancel: () => {
              markAnswered(intr.id);
              setFailure(null);
              settle(cancel(intr.id));
            },
          };
        })
        .filter((x): x is ActiveInterrupt => x !== null);

      const resumer = continuations.length > 0 && (
        <ContinuationResolver ids={continuations} resolve={resolve} />
      );

      if (active.length === 0) {
        return <>{resumer}</>;
      }

      const approvals = active.filter((a) => a.reason.type === "approval");

      return (
        <>
          {resumer}
          <InterruptFailure />
          {bridge && <InterruptBridgePublisher interrupts={active} />}
          {approvals.length > 1 && <ApprovalBatchBar approvals={approvals} />}
          {active.map((a) => (
            <ChatInterruptSlot key={a.id} interrupt={a} Renderer={renderers?.[a.reason.type]} />
          ))}
        </>
      );
    },
  });

  return <KabooAskUser agentId={agentId} />;
}
