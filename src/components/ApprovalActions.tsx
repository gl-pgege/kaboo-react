import { useEffect, useState, type ReactElement } from "react";
import { useApprovalScopes } from "../context/InterruptRenderers";
import type {
  ApprovalDecision,
  ApprovalReason,
  ApprovalScope,
  InterruptRendererProps,
} from "../types";

/** What {@link useApprovalDecision} offers a card. */
export interface ApprovalDecisionControls {
  /** The scopes to offer: the agent's and the app's, `once` first. */
  scopes: ApprovalScope[];
  /** Whether the request's deadline has passed; it can then only be dismissed. */
  expired: boolean;
  /** Milliseconds until the deadline, or `null` when the request has none. */
  expiresInMs: number | null;
  /** Whether this card already answered. */
  responded: boolean;
  /**
   * Approve the call. With `thread` or `always`, `KabooInterruptHandler` also
   * approves the other waiting requests the decision covers (same tool and
   * subject).
   */
  approve: (scope?: ApprovalScope, toolInput?: unknown) => void;
  /** Deny the call, with the person's optional reason for the agent. */
  deny: (reason?: string) => void;
  /** Skip the request without answering. */
  dismiss: () => void;
}

function useNow(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [enabled]);
  return now;
}

/**
 * The standard approval decisions for a card: which scopes to offer, the
 * deadline, and approve / deny / dismiss bound to the request. Use it to build
 * a custom approval card that behaves like the built-in one, or render
 * {@link ApprovalActions} for the standard buttons.
 *
 * @example
 * ```tsx
 * import { useApprovalDecision, type ApprovalReason, type InterruptRendererProps } from "@pgege/kaboo-react";
 *
 * function OneClickApproval(props: InterruptRendererProps<ApprovalReason>) {
 *   const decision = useApprovalDecision(props);
 *   if (decision.responded) return <p>Sent.</p>;
 *   return <button onClick={() => decision.approve("once")}>Approve {props.reason.tool_name}</button>;
 * }
 * ```
 */
export function useApprovalDecision({
  reason,
  onResolve,
  onCancel,
}: InterruptRendererProps<ApprovalReason>): ApprovalDecisionControls {
  const allowed = useApprovalScopes();
  const [responded, setResponded] = useState(false);
  const deadline = reason.expiresAt ? Date.parse(reason.expiresAt) : NaN;
  const hasDeadline = Number.isFinite(deadline);
  const now = useNow(hasDeadline && !responded);
  const expiresInMs = hasDeadline ? Math.max(0, deadline - now) : null;
  const offered = reason.scopes && reason.scopes.length > 0 ? reason.scopes : ["once" as const];
  const scopes = (["once", "thread", "always"] as const).filter(
    (s) => s === "once" || (offered.includes(s) && allowed.includes(s)),
  );

  const answer = (decision: ApprovalDecision) => {
    setResponded(true);
    onResolve(decision);
  };

  return {
    scopes: [...scopes],
    expired: expiresInMs === 0,
    expiresInMs,
    responded,
    approve: (scope = "once", toolInput) => {
      answer({ status: "approved", scope, ...(toolInput !== undefined ? { tool_input: toolInput } : {}) });
    },
    deny: (why) => {
      const text = why?.trim();
      answer({ status: "cancelled", ...(text ? { reason: text } : {}) });
    },
    dismiss: () => {
      setResponded(true);
      onCancel();
    },
  };
}

function formatRemaining(ms: number): string {
  const minutes = Math.ceil(ms / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h` : `${Math.round(hours / 24)} days`;
}

/**
 * The standard approval buttons: Approve, Allow for this chat and Always allow
 * (only the scopes offered, with "Applies to …" naming what they cover), Deny
 * with an optional reason, the deadline, and Dismiss once it has passed. The
 * built-in approval card renders it under its summary; a custom card can do
 * the same to keep the standard options.
 *
 * @example
 * ```tsx
 * import { ApprovalActions, type ApprovalReason, type InterruptRendererProps } from "@pgege/kaboo-react";
 *
 * function PriceChangeCard(props: InterruptRendererProps<ApprovalReason>) {
 *   return (
 *     <div>
 *       <p>Change the price of this product?</p>
 *       <ApprovalActions {...props} />
 *     </div>
 *   );
 * }
 * ```
 */
export function ApprovalActions(props: InterruptRendererProps<ApprovalReason>): ReactElement {
  const decision = useApprovalDecision(props);
  const [denying, setDenying] = useState(false);
  const [why, setWhy] = useState("");

  if (decision.responded) {
    return <div className="kaboo-interrupt-responded">Response submitted</div>;
  }

  if (decision.expired) {
    return (
      <div className="kaboo-interrupt-actions kaboo-approval-actions">
        <span className="kaboo-approval-expiry kaboo-approval-expired">This request expired.</span>
        <button className="kaboo-interrupt-btn kaboo-approval-dismiss" onClick={decision.dismiss}>
          Dismiss
        </button>
      </div>
    );
  }

  if (denying) {
    return (
      <form
        className="kaboo-approval-deny"
        onSubmit={(e) => {
          e.preventDefault();
          decision.deny(why);
        }}
      >
        <input
          className="kaboo-interrupt-text-input kaboo-approval-reason"
          placeholder="Tell the assistant why (optional)"
          aria-label="Reason for denying"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          autoFocus
        />
        <div className="kaboo-interrupt-actions">
          <button type="submit" className="kaboo-interrupt-btn kaboo-interrupt-btn-reject">
            Deny
          </button>
          <button
            type="button"
            className="kaboo-interrupt-btn kaboo-interrupt-btn-back"
            onClick={() => setDenying(false)}
          >
            Back
          </button>
        </div>
      </form>
    );
  }

  const covers = decision.scopes.length > 1 ? props.reason.subject?.label : undefined;

  return (
    <>
      {covers && <div className="kaboo-approval-covers">Applies to {covers}</div>}
      <div className="kaboo-interrupt-actions kaboo-approval-actions">
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-approve"
          onClick={() => decision.approve("once")}
        >
          Approve
        </button>
        {decision.scopes.includes("thread") && (
          <button
            className="kaboo-interrupt-btn kaboo-approval-scope kaboo-approval-scope-thread"
            onClick={() => decision.approve("thread")}
          >
            Allow for this chat
          </button>
        )}
        {decision.scopes.includes("always") && (
          <button
            className="kaboo-interrupt-btn kaboo-approval-scope kaboo-approval-scope-always"
            onClick={() => decision.approve("always")}
          >
            Always allow
          </button>
        )}
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-reject"
          onClick={() => setDenying(true)}
        >
          Deny
        </button>
        {decision.expiresInMs !== null && (
          <span className="kaboo-approval-expiry">Expires in {formatRemaining(decision.expiresInMs)}</span>
        )}
      </div>
    </>
  );
}
