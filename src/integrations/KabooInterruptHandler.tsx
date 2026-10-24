import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactElement } from "react";
import { useAgent, useCopilotKit, useInterrupt } from "@copilotkit/react-core/v2";
import { useInterruptRenderer, type InterruptRenderers } from "../context/InterruptRenderers";
import { useActivity } from "../hooks/useActivity";
import type { ApprovalDecision, ApprovalReason, CustomRequestReason, InterruptReason } from "../types";

/** One open request, as the handler renders it. */
interface OpenRequest {
  id: string;
  reason: InterruptReason | CustomRequestReason;
  toolCallId?: string;
  subagentRunId?: string;
}

function isExpired(reason: ApprovalReason): boolean {
  const deadline = reason.expiresAt ? Date.parse(reason.expiresAt) : NaN;
  return Number.isFinite(deadline) && deadline <= Date.now();
}

function subjectOf(reason: ApprovalReason): string | undefined {
  return reason.subject?.key ?? reason.tool_name;
}

function RequestCard({
  request,
  renderers,
  onResolve,
  onCancel,
}: {
  request: OpenRequest;
  renderers?: InterruptRenderers;
  onResolve: (payload: unknown) => void;
  onCancel: () => void;
}): ReactElement {
  const registered = useInterruptRenderer(request.reason.type);
  const Renderer = renderers?.[request.reason.type] ?? registered;
  const { groups } = useActivity();
  const card = (
    <Renderer
      reason={request.reason}
      toolCallId={request.toolCallId}
      onResolve={onResolve}
      onCancel={onCancel}
    />
  );
  if (!request.subagentRunId) return card;
  const group = groups[request.subagentRunId];
  return (
    <div className="kaboo-request-from-agent">
      <div className="kaboo-request-agent">{group?.title ?? group?.agentName ?? "A sub-agent"}</div>
      {card}
    </div>
  );
}

/**
 * The open requests of one pause. Two or more approvals waiting at once get
 * "Approve all" and "Deny all", and a decision for the whole chat or for
 * always also approves the other waiting requests it covers.
 */
function OpenRequests({
  requests,
  renderers,
  resolve,
  cancel,
}: {
  requests: OpenRequest[];
  renderers?: InterruptRenderers;
  resolve: (payload: unknown, id: string) => void;
  cancel: (id: string) => void;
}): ReactElement {
  const [answered, setAnswered] = useState<ReadonlySet<string>>(new Set());
  const waiting = requests.filter((request) => !answered.has(request.id));
  const approvals = waiting.filter((request) => request.reason.type === "approval");

  const settle = (ids: string[]) => setAnswered((current) => new Set([...current, ...ids]));
  const answer = (request: OpenRequest, payload: unknown) => {
    const covered: OpenRequest[] = [];
    const decision = payload as ApprovalDecision | undefined;
    if (request.reason.type === "approval" && decision?.status === "approved" && decision.scope && decision.scope !== "once") {
      const reason = request.reason as ApprovalReason;
      covered.push(
        ...approvals.filter((other) => {
          if (other.id === request.id) return false;
          const theirs = other.reason as ApprovalReason;
          return theirs.tool_name === reason.tool_name && subjectOf(theirs) === subjectOf(reason);
        }),
      );
    }
    settle([request.id, ...covered.map((other) => other.id)]);
    resolve(payload, request.id);
    for (const other of covered) resolve({ status: "approved", scope: "once" } satisfies ApprovalDecision, other.id);
  };
  const approveAll = () => {
    settle(approvals.map((request) => request.id));
    for (const request of approvals) {
      if (isExpired(request.reason as ApprovalReason)) cancel(request.id);
      else resolve({ status: "approved", scope: "once" } satisfies ApprovalDecision, request.id);
    }
  };
  const denyAll = () => {
    settle(approvals.map((request) => request.id));
    for (const request of approvals) resolve({ status: "cancelled" } satisfies ApprovalDecision, request.id);
  };

  return (
    <>
      {approvals.length > 1 && (
        <div className="kaboo-approval-batch" role="group" aria-label="Waiting approvals">
          <span className="kaboo-approval-batch-count">{approvals.length} approvals waiting</span>
          <div className="kaboo-interrupt-actions">
            <button className="kaboo-interrupt-btn kaboo-interrupt-btn-approve" onClick={approveAll}>
              Approve all
            </button>
            <button className="kaboo-interrupt-btn kaboo-interrupt-btn-reject" onClick={denyAll}>
              Deny all
            </button>
          </div>
        </div>
      )}
      {requests.map((request) =>
        answered.has(request.id) ? (
          <div key={request.id} className="kaboo-interrupt-responded">
            Response submitted
          </div>
        ) : (
          <RequestCard
            key={request.id}
            request={request}
            renderers={renderers}
            onResolve={(payload) => answer(request, payload)}
            onCancel={() => {
              settle([request.id]);
              cancel(request.id);
            }}
          />
        ),
      )}
    </>
  );
}

/**
 * Why the last answers failed, and how many times they have, shared with the
 * requests CopilotKit renders elsewhere in the chat so they update with it.
 */
interface Recovery {
  failure: string | null;
  attempt: number;
}

function createRecoveryStore() {
  let state: Recovery = { failure: null, attempt: 0 };
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(next: Partial<Recovery>) {
      state = { ...state, ...next };
      for (const listener of listeners) listener();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

type RecoveryStore = ReturnType<typeof createRecoveryStore>;

function Pause({
  store,
  requests,
  renderers,
  resolve,
  cancel,
}: {
  store: RecoveryStore;
  requests: OpenRequest[];
  renderers?: InterruptRenderers;
  resolve: (payload: unknown, id: string) => void;
  cancel: (id: string) => void;
}): ReactElement {
  const { failure, attempt } = useSyncExternalStore(store.subscribe, store.get, store.get);
  return (
    <>
      {failure && (
        <p className="kaboo-interrupt-error" role="alert">
          {failure}
        </p>
      )}
      <OpenRequests
        key={`${attempt}:${requests.map((request) => request.id).join(",")}`}
        requests={requests}
        renderers={renderers}
        resolve={resolve}
        cancel={cancel}
      />
    </>
  );
}

/** Whether a run carries answers a person gave. */
function answers(input: unknown): boolean {
  const resume = (input as { resume?: unknown[] } | undefined)?.resume;
  return Array.isArray(resume) && resume.length > 0;
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
  /** Renderer overrides keyed by request kind (`approval`, or an app's own). */
  renderers?: InterruptRenderers;
  /**
   * Called with the reason when an answer never reached the agent (the host
   * refused it, or it couldn't be sent). The requests come back to be
   * answered again either way; use this to show the reason elsewhere too,
   * such as a toast.
   */
  onInterruptError?: (message: string) => void;
}

/**
 * Ready-made handler for the requests a run pauses on: approvals and an app's
 * own request kinds, on CopilotKit's `useInterrupt`. Every open request of a
 * pause renders at once, each answered by its own id; the run resumes once all
 * are answered. A sub-agent's request names the agent that made it.
 *
 * A message sent while requests wait skips them (see `useKabooSend`). When
 * answers never reach the agent (the host refuses a decision, or the request
 * fails), the requests come back to be answered again, with the reason above
 * them and passed to `onInterruptError`.
 *
 * @example
 * ```tsx
 * import { CopilotKit } from "@copilotkit/react-core/v2";
 * import { KabooInterruptHandler } from "@pgege/kaboo-react/copilotkit";
 *
 * function Hitl({ children }: { children: React.ReactNode }) {
 *   return (
 *     <CopilotKit runtimeUrl="/api/copilotkit" agent="assistant">
 *       <KabooInterruptHandler agentId="assistant" />
 *       {children}
 *     </CopilotKit>
 *   );
 * }
 * ```
 */
export function KabooInterruptHandler({
  agentId,
  renderers,
  onInterruptError,
}: KabooInterruptHandlerProps): ReactElement | null {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ ...(agentId ? { agentId } : {}), updates: [] });
  const [store] = useState(createRecoveryStore);
  const onInterruptErrorRef = useRef(onInterruptError);
  onInterruptErrorRef.current = onInterruptError;
  const recovering = useRef(false);

  const recover = useCallback(
    (message: string) => {
      if (recovering.current) return;
      recovering.current = true;
      store.set({ failure: message, attempt: store.get().attempt + 1 });
      onInterruptErrorRef.current?.(message);
      if (!agent) {
        recovering.current = false;
        return;
      }
      void Promise.resolve(copilotkit.connectAgent({ agent }))
        .catch(() => undefined)
        .finally(() => {
          recovering.current = false;
        });
    },
    [agent, copilotkit, store],
  );

  useFailedAnswers(agentId, recover);

  const settle = (pending: unknown) => {
    void Promise.resolve(pending).catch((error: unknown) => {
      if (!isAbort(error)) recover(sendFailure(error));
    });
  };

  useInterrupt({
    ...(agentId ? { agentId } : {}),
    render: ({ interrupts, resolve, cancel }) => {
      const requests = (interrupts ?? [])
        .map((intr): OpenRequest | null => {
          const reason = intr?.metadata as InterruptReason | CustomRequestReason | undefined;
          if (!reason || !reason.type) return null;
          return {
            id: intr.id,
            reason,
            ...(intr.toolCallId ? { toolCallId: intr.toolCallId } : {}),
            ...(intr.subagentRunId ? { subagentRunId: intr.subagentRunId } : {}),
          };
        })
        .filter((request): request is OpenRequest => request !== null);

      return requests.length > 0 ? (
        <Pause
          store={store}
          requests={requests}
          renderers={renderers}
          resolve={(payload, id) => {
            store.set({ failure: null });
            settle(resolve(payload, id));
          }}
          cancel={(id) => {
            store.set({ failure: null });
            settle(cancel(id));
          }}
        />
      ) : (
        <></>
      );
    },
  });

  return null;
}
