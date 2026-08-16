import { useState } from "react";
import type { GroupEntry } from "../utils/groups";
import { useTurnFeedback, type FeedbackHandler } from "./useTurnFeedback";

/** Props for {@link TurnFeedback}. */
export interface TurnFeedbackProps {
  /** The turn's activity groups (e.g. `TurnFooterContext.groups`). */
  groups: GroupEntry[];
  /** Host sink for the score — kaboo-react stores nothing itself. */
  onFeedback: FeedbackHandler;
  /**
   * Render nothing when the turn has no resolvable `traceId` (i.e. the
   * workflow service ran without telemetry, so a score would have nothing to
   * attach to). Defaults to `false`: feedback is still collected with
   * `runId`/`turnId` correlation only.
   */
  requireTrace?: boolean;
  /** Prompt shown next to the buttons. Defaults to "Was this helpful?". */
  label?: string;
}

/**
 * A minimal thumbs up / thumbs down control for one turn, designed for the
 * {@link KabooSlots.turnFooter} slot. Thumbs down opens an optional comment
 * box before submitting. All storage flows through the host's `onFeedback`.
 *
 * @example
 * ```tsx
 * import { KabooProvider, TurnFeedback } from "@pgege/kaboo-react";
 *
 * function slots() {
 *   return {
 *     turnFooter: (ctx: { groups: Parameters<typeof TurnFeedback>[0]["groups"] }) => (
 *       <TurnFeedback
 *         groups={ctx.groups}
 *         onFeedback={(p) =>
 *           fetch("/api/feedback", { method: "POST", body: JSON.stringify(p) })
 *         }
 *       />
 *     ),
 *   };
 * }
 * ```
 */
export function TurnFeedback({ groups, onFeedback, requireTrace = false, label }: TurnFeedbackProps) {
  const { submit, submitted, submitting, traceId } = useTurnFeedback(groups, onFeedback);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");

  if (requireTrace && !traceId) return null;

  if (submitted != null) {
    return (
      <div className="kaboo-feedback kaboo-feedback-done">
        {submitted === 1 ? "Thanks for the feedback!" : "Thanks — we'll use this to improve."}
      </div>
    );
  }

  const sendNegative = () => {
    void submit(0, comment.trim() || undefined);
  };

  return (
    <div className="kaboo-feedback">
      <span className="kaboo-feedback-label">{label ?? "Was this helpful?"}</span>
      <button
        type="button"
        className="kaboo-feedback-btn"
        aria-label="Helpful"
        disabled={submitting}
        onClick={() => void submit(1)}
      >
        👍
      </button>
      <button
        type="button"
        className={`kaboo-feedback-btn${commenting ? " kaboo-feedback-btn-active" : ""}`}
        aria-label="Not helpful"
        disabled={submitting}
        onClick={() => (commenting ? sendNegative() : setCommenting(true))}
      >
        👎
      </button>
      {commenting && (
        <span className="kaboo-feedback-comment">
          <input
            className="kaboo-feedback-input"
            placeholder="What went wrong? (optional)"
            value={comment}
            disabled={submitting}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendNegative();
            }}
          />
          <button
            type="button"
            className="kaboo-feedback-btn"
            disabled={submitting}
            onClick={sendNegative}
          >
            Send
          </button>
        </span>
      )}
    </div>
  );
}
