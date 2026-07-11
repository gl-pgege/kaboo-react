import { useState, useEffect, useRef, useContext } from "react";
import type { StreamGroup } from "../types";
import { isControlOnlyStatus, normalizeResult } from "../formatters/output";
import { MarkdownContent } from "./MarkdownContent";
import { Timeline } from "./Timeline";
import { useDrill } from "../hooks/useDrill";
import { useActivity } from "../hooks/useActivity";
import { StructuredRenderersContext } from "../context/ActivityProvider";
import { directChildren, partitionChildrenByToolCall } from "../utils/groups";

/** Props for {@link AgentCard}. */
export interface AgentCardProps {
  /** Id of the group this card renders. */
  groupId: string;
  /** The activity group to render. */
  group: StreamGroup;
  /** Task/input text to show, overriding the group's own `task`. */
  input?: string;
  /** Raw tool result to render as the card's answer, when provided by the host. */
  result?: string;
  /** Host-provided action status (e.g. `"complete"`) used to mark the card done. */
  actionStatus?: string;
  /**
   * When true, the card renders its `directChildren` inline as nested
   * {@link AgentCard}s (recursively). Used by the first-class swarm/graph inline
   * renderer to show the whole member tree without the drill navigation. Left
   * off (default) for the delegate path and the drill views, which surface
   * children through their own navigation.
   */
  showChildren?: boolean;
}

/**
 * Card for a single agent run: title, status badge, task, chronological timeline
 * (text + tool rows), result/structured output, and a "View details" drill
 * button. Delegated sub-agents are interleaved at their tool-call position; with
 * `showChildren` the card renders its whole child tree inline.
 *
 * @example
 * ```tsx
 * import { AgentCard, useActivity } from "@kaboo/react";
 *
 * function FirstCard() {
 *   const { groups } = useActivity();
 *   const [id, group] = Object.entries(groups)[0] ?? [];
 *   return id ? <AgentCard groupId={id} group={group} /> : null;
 * }
 * ```
 */
export function AgentCard({ groupId, group, input, result, actionStatus, showChildren }: AgentCardProps) {
  const { drillIn } = useDrill();
  const { groups } = useActivity();
  const structuredRenderers = useContext(StructuredRenderersContext);
  const childEntries = showChildren ? directChildren(groups, groupId) : [];
  const isDone = group.status === "completed" || actionStatus === "complete";
  const isInterrupted = group.status === "interrupted" && group.interrupt;
  const [expanded, setExpanded] = useState(true);
  const prevDone = useRef(isDone);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Keep cards that captured a human-in-the-loop `ask_user` expanded on
  // completion so the answered Q&A stays visible, matching the top-level path.
  // Cards with no interaction still auto-collapse to keep deep trees tidy.
  const hasInteraction = group.tools.some((t) => t.toolName === "ask_user");
  useEffect(() => {
    if (!prevDone.current && isDone && !hasInteraction) setExpanded(false);
    prevDone.current = isDone;
  }, [isDone, hasInteraction]);

  // A resolved HITL interrupt leaves the delegate tool result as a bare control
  // echo (e.g. {"status":"approved"} or {"status":"cancelled"}). That is not the
  // agent's answer — the gated action is already shown in the timeline and the
  // reply streams separately — so never render the raw echo as the card's result.
  const resultText = isControlOnlyStatus(result) ? null : normalizeResult(result);
  const displayTask = input ?? group.task ?? undefined;
  // Only the chat-reply agent's text is already shown in the chat bubble, so we
  // strip text from just that card to avoid duplicating the answer (R4). Every
  // other member keeps its findings text. The drill views keep the full
  // timeline regardless.
  const timeline =
    showChildren && group.isChatReply
      ? (group.timeline ?? []).filter((e) => e.type === "tool")
      : (group.timeline ?? []);

  useEffect(() => {
    if (expanded && !isDone && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [expanded, isDone, timeline]);

  // Interleave delegated children at their delegating tool-call position so a
  // sub-agent's card stays in order with the parent's surrounding text, instead
  // of being dumped in a trailing block after the summary.
  const { byToolCall: childByToolCall, leftover: leftoverChildren } =
    partitionChildrenByToolCall(childEntries, timeline);
  const renderToolCard = (toolUseId: string) => {
    const entry = childByToolCall.get(toolUseId);
    if (!entry) return null;
    return <AgentCard groupId={entry[0]} group={entry[1]} showChildren />;
  };

  const hasContent =
    timeline.length > 0 || resultText || childEntries.length > 0 || !!displayTask;

  const cardClass = `kaboo-agent-card${isDone ? " kaboo-agent-card-done" : ""}`;

  return (
    <div className={cardClass}>
      <div className="kaboo-agent-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="kaboo-agent-card-title-area">
          <div className="kaboo-agent-card-title-row">
            <span className="kaboo-agent-card-title">{group.title}</span>
            <span className={`kaboo-status-badge ${isDone ? "kaboo-status-done" : isInterrupted ? "kaboo-status-interrupted" : "kaboo-status-active"}`}>
              {isDone ? (
                <svg width={10} height={10} viewBox="0 0 16 16">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : isInterrupted ? (
                <svg width={10} height={10} viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                </svg>
              ) : (
                <svg width={10} height={10} viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="22" strokeDashoffset="6">
                    <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                </svg>
              )}
              {isDone ? "done" : isInterrupted ? "needs input" : "working..."}
            </span>
          </div>
          <div className="kaboo-agent-card-subtitle">{group.agentName}</div>
        </div>

        {group.tools.length > 0 && (
          <span className={`kaboo-tool-count ${isDone ? "kaboo-tool-count-done" : ""}`}>
            {group.tools.length} tool{group.tools.length !== 1 ? "s" : ""}
          </span>
        )}

        <svg
          width={14} height={14} viewBox="0 0 16 16"
          className={`kaboo-chevron ${expanded ? "kaboo-chevron-open" : ""}`}
        >
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {!expanded && displayTask && (
        <div className="kaboo-agent-card-collapsed">
          <strong>Task:</strong> {displayTask}
        </div>
      )}

      {expanded && (
        <div ref={bodyRef} className="kaboo-agent-card-body">
          {displayTask && (
            <div className="kaboo-agent-card-task">
              <strong>Task:</strong> {displayTask}
            </div>
          )}

          {timeline.length > 0 && (
            <div className="kaboo-agent-card-timeline">
              <Timeline timeline={timeline} active={!isDone} variant="card" renderToolCard={renderToolCard} />
            </div>
          )}

          {resultText && (
            <div className="kaboo-agent-card-result">
              <MarkdownContent text={resultText} />
            </div>
          )}

          {group.structuredOutput && group.outputSchemaName && (() => {
            const Renderer = structuredRenderers[group.outputSchemaName!];
            if (Renderer) {
              return <Renderer {...group.structuredOutput!} />;
            }
            return (
              <details className="kaboo-agent-card-structured">
                <summary className="kaboo-agent-card-structured-summary">
                  Structured output ({group.outputSchemaName})
                </summary>
                <pre className="kaboo-agent-card-structured-pre">
                  {JSON.stringify(group.structuredOutput, null, 2)}
                </pre>
              </details>
            );
          })()}

          {leftoverChildren.length > 0 && (
            <div className="kaboo-agent-card-children">
              {leftoverChildren.map(([childId, child]) => (
                <AgentCard
                  key={childId}
                  groupId={childId}
                  group={child}
                  showChildren
                />
              ))}
            </div>
          )}

          {!displayTask && !hasContent && (
            <div className="kaboo-agent-card-empty">Working...</div>
          )}
        </div>
      )}

      {hasContent && (
        <button
          className="kaboo-drill-btn"
          onClick={(e) => { e.stopPropagation(); drillIn(groupId); }}
        >
          <span>View details</span>
          <svg width={12} height={12} viewBox="0 0 16 16">
            <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
