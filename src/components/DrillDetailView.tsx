import { useEffect, useRef } from "react";
import { useActivity } from "../hooks/useActivity";
import { useDrill } from "../hooks/useDrill";
import { useInterruptBridge } from "../context/InterruptBridge";
import {
  directChildren,
  partitionChildrenByToolCall,
  pendingToolAnchorExists,
} from "../utils/groups";
import { AgentCard } from "./AgentCard";
import { Timeline } from "./Timeline";
import { InterruptRenderer } from "./InterruptRenderer";

/**
 * Detail pane for the currently drilled-in group: its task, full timeline
 * (with delegated sub-agents interleaved at their tool-call position), any
 * unanchored interrupt prompts, and a "Sub-agents" section for swarm/graph
 * members. Renders a hidden placeholder at the root. Pair with {@link GlassTabs}.
 *
 * @example
 * ```tsx
 * import { GlassTabs, DrillDetailView } from "kaboo-react";
 *
 * function DrillArea() {
 *   return (
 *     <>
 *       <GlassTabs />
 *       <DrillDetailView />
 *     </>
 *   );
 * }
 * ```
 */
export function DrillDetailView() {
  const { activeDrill } = useDrill();
  const { groups } = useActivity();
  const { active: activeInterrupts } = useInterruptBridge();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDrill && bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [activeDrill]);

  if (!activeDrill) {
    return <div className="kaboo-drill-detail kaboo-hidden" />;
  }

  const group = groups[activeDrill];
  const timeline = group?.timeline ?? [];
  // Prompts anchored to a pending tool call are rendered inline by the Timeline
  // at that tool's position (chronological); this block only handles interrupts
  // with no on-screen tool anchor — never a duplicate.
  const unanchoredInterrupts =
    group?.status === "interrupted"
      ? activeInterrupts.filter(
          (i) => !pendingToolAnchorExists(groups, i.toolCallId),
        )
      : [];

  const childEntries = directChildren(groups, activeDrill);
  // Interleave delegated children at their delegating tool-call position so a
  // sub-agent's card sits where it was delegated (before the parent's summary
  // text) rather than in a trailing block. Children with no tool-call anchor
  // (swarm/graph members) still render in the Sub-agents section below.
  const { byToolCall: childByToolCall, leftover: leftoverChildren } =
    partitionChildrenByToolCall(childEntries, timeline);
  const renderToolCard = (toolUseId: string) => {
    const entry = childByToolCall.get(toolUseId);
    if (!entry) return null;
    return <AgentCard groupId={entry[0]} group={entry[1]} />;
  };

  return (
    <div ref={bodyRef} className="kaboo-drill-detail">
      <div className="kaboo-drill-detail-inner">
        {group?.task && (
          <div className="kaboo-agent-card-task kaboo-drill-task">
            <strong>Task:</strong> {group.task}
          </div>
        )}

        {group && timeline.length > 0 && (
          <div className="kaboo-drill-timeline">
            <Timeline
              timeline={timeline}
              active={group.status === "active"}
              variant="drill"
              renderToolCard={renderToolCard}
            />
          </div>
        )}

        {unanchoredInterrupts.length > 0 && (
          <div className="kaboo-drill-interrupt">
            {unanchoredInterrupts.map((it) => (
              <InterruptRenderer
                key={it.id}
                reason={it.reason}
                toolCallId={it.toolCallId}
                onResolve={it.onResolve}
                onCancel={it.onCancel}
              />
            ))}
          </div>
        )}

        {leftoverChildren.length > 0 && (
          <div className="kaboo-drill-children">
            <div className="kaboo-drill-section-label">Sub-agents</div>
            {leftoverChildren.map(([id, childGroup]) => (
              <AgentCard key={id} groupId={id} group={childGroup} />
            ))}
          </div>
        )}

        {group && timeline.length === 0 && childEntries.length === 0 && (
          <div className="kaboo-agent-card-empty">
            Working...
          </div>
        )}

        {!group && (
          <div className="kaboo-agent-card-empty">
            No activity data for this group.
          </div>
        )}
      </div>
    </div>
  );
}
