import { useCallback, useState } from "react";
import type { GroupEntry } from "../utils/groups";
import { useActivity } from "../hooks/useActivity";

/**
 * The payload handed to a host's `onFeedback` callback when the user scores a
 * turn. kaboo-react has no storage opinion: the host forwards this wherever it
 * evaluates runs (typically its backend, which posts a score to an
 * observability platform by `traceId`).
 */
export interface FeedbackPayload {
  /** `1` for positive feedback (thumbs up), `0` for negative (thumbs down). */
  value: 0 | 1;
  /** Optional free-text comment accompanying the score. */
  comment?: string;
  /**
   * OpenTelemetry trace id of the turn's root run, when the workflow service
   * ran with telemetry enabled. The key for attaching the score to the exact
   * trace in the host's observability backend.
   */
  traceId?: string;
  /** AG-UI run id of the turn's (first) run, when known. */
  runId?: string;
  /** kaboo's logical turn id (stable across interrupt/resume), when known. */
  turnId?: string;
}

/** A host-provided sink for {@link FeedbackPayload}. May be async. */
export type FeedbackHandler = (payload: FeedbackPayload) => void | Promise<void>;

/** What {@link useTurnFeedback} returns. */
export interface TurnFeedbackState {
  /** The score the user already submitted for this turn, if any. */
  submitted?: 0 | 1;
  /** Whether a submission is currently in flight. */
  submitting: boolean;
  /**
   * Submit a score for the turn. Resolves the turn's `traceId` / `runId` /
   * `turnId` from its activity groups and invokes the host's `onFeedback`.
   */
  submit: (value: 0 | 1, comment?: string) => Promise<void>;
  /**
   * The turn's resolved trace id, if the service ran with telemetry enabled.
   * Hosts can use its absence to hide feedback UI when scores would have
   * nothing to attach to.
   */
  traceId?: string;
}

/**
 * Resolve the identifying ids for a turn from the activity groups it produced.
 * The run-level trace (`traceByRun`) wins over any group's own `traceId`
 * because nested agents may complete under their own invocation traces.
 */
export function resolveTurnIds(
  groups: GroupEntry[],
  traceByRun?: Record<string, string>,
): { traceId?: string; runId?: string; turnId?: string } {
  let runId: string | undefined;
  let turnId: string | undefined;
  let groupTraceId: string | undefined;
  for (const [, g] of groups) {
    if (!runId && g.runId) runId = g.runId;
    if (!turnId && g.turnId) turnId = g.turnId;
    if (!groupTraceId && g.traceId) groupTraceId = g.traceId;
  }
  const traceId = (runId && traceByRun?.[runId]) || groupTraceId;
  return { traceId, runId, turnId };
}

/**
 * Headless feedback state for one turn: resolves the turn's correlation ids
 * from its activity groups and tracks the submitted score. Pure mechanism —
 * the host supplies the storage via `onFeedback`, and can build any UI on top
 * (or use the bundled {@link TurnFeedback} buttons).
 *
 * @example
 * ```tsx
 * import { useTurnFeedback, type GroupEntry } from "@pgege/kaboo-react";
 *
 * function Score({ groups }: { groups: GroupEntry[] }) {
 *   const { submit, submitted } = useTurnFeedback(groups, (p) =>
 *     fetch("/api/feedback", { method: "POST", body: JSON.stringify(p) }),
 *   );
 *   return submitted != null ? <span>thanks!</span> : (
 *     <button onClick={() => submit(1)}>Helpful</button>
 *   );
 * }
 * ```
 */
export function useTurnFeedback(
  groups: GroupEntry[],
  onFeedback: FeedbackHandler,
): TurnFeedbackState {
  const activity = useActivity();
  const [submitted, setSubmitted] = useState<0 | 1 | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const { traceId, runId, turnId } = resolveTurnIds(groups, activity.traceByRun);

  const submit = useCallback(
    async (value: 0 | 1, comment?: string) => {
      setSubmitting(true);
      try {
        await onFeedback({ value, comment, traceId, runId, turnId });
        setSubmitted(value);
      } finally {
        setSubmitting(false);
      }
    },
    [onFeedback, traceId, runId, turnId],
  );

  return { submitted, submitting, submit, traceId };
}
