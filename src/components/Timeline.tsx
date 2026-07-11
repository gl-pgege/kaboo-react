import { Fragment, type ReactNode } from "react";
import type { TimelineEntry, ToolCall } from "../types";
import { ToolRow } from "./ToolRow";
import { MarkdownContent } from "./MarkdownContent";
import { AskUserSummary } from "./AskUserSummary";
import { InterruptRenderer } from "./InterruptRenderer";
import { useInterruptFor } from "../context/InterruptBridge";
import { normalizeQuestions, parseAnswers, type AskUserParams } from "../formatters/askUser";
import { isCancelledResult } from "../formatters/output";

/**
 * Renders an `ask_user` tool call in one place at its chronological tool
 * position — the live interactive form while it's pending, then the durable Q&A
 * summary once answered. Both look identical at every depth (top-level card or a
 * nested drill), so the human-in-the-loop prompt never floats out of order in a
 * separate slot. The live form is claimed by matching an open interrupt's
 * `toolCallId` to this tool; if none matches (already answered, or a different
 * agent's prompt) nothing interactive is drawn here.
 */
function AskUserTimelineRow({ tool }: { tool: ToolCall }) {
  const interrupt = useInterruptFor(tool.toolUseId);
  const questions = normalizeQuestions(tool.toolInput as AskUserParams | undefined);
  const answers = parseAnswers(tool.toolResult);

  if (answers) {
    if (questions.length === 0) return null;
    return <AskUserSummary questions={questions} answers={answers} />;
  }

  if (interrupt && interrupt.reason.type === "form") {
    return (
      <InterruptRenderer
        reason={interrupt.reason}
        toolCallId={interrupt.toolCallId}
        onResolve={interrupt.onResolve}
        onCancel={interrupt.onCancel}
      />
    );
  }

  // Resolved without answers (the user dismissed the prompt): keep it visible in
  // order as a declined Q&A rather than silently dropping it.
  if (questions.length > 0 && isCancelledResult(tool.toolResult)) {
    return <AskUserSummary questions={questions} answers={{}} declined />;
  }

  return null;
}

/**
 * A regular tool row that also surfaces its own approval gate inline. When a
 * gated tool is awaiting approval it has an open interrupt anchored to this
 * tool-call id; the Approve/Reject prompt renders directly under the row so it
 * sits at the request it governs. With N tools gated in parallel each row owns
 * its own card and resolves independently.
 */
function ToolTimelineRow({ tool }: { tool: ToolCall }) {
  const interrupt = useInterruptFor(tool.toolUseId);
  return (
    <>
      <ToolRow tool={tool} />
      {interrupt && interrupt.reason.type === "approval" && (
        <InterruptRenderer
          reason={interrupt.reason}
          toolCallId={interrupt.toolCallId}
          onResolve={interrupt.onResolve}
          onCancel={interrupt.onCancel}
        />
      )}
    </>
  );
}

/** Props for {@link Timeline}. */
export interface TimelineProps {
  /** The interleaved text/tool entries to render, in order. */
  timeline: TimelineEntry[];
  /** When true, a blinking cursor is shown after the last text segment. */
  active: boolean;
  /** Visual variant selecting the text container class. */
  variant?: "card" | "drill";
  /**
   * Optional hook to render a delegating tool call as its spawned sub-agent
   * card, interleaved at its chronological position. Returns the card node for a
   * given tool-call id, or `null`/`undefined` to fall back to the tool row. Keeps
   * a delegated agent's work in order relative to the parent's surrounding text.
   */
  renderToolCard?: (toolUseId: string) => ReactNode | null | undefined;
}

/**
 * Chronological render of interleaved text segments and tool calls. Shared by
 * {@link AgentCard} and {@link DrillDetailView} so the two stay in sync.
 */
export function Timeline({ timeline, active, variant = "card", renderToolCard }: TimelineProps) {
  const textClass =
    variant === "drill" ? "kaboo-drill-tokens-content" : "kaboo-agent-card-tokens";

  return (
    <>
      {timeline.map((entry, i) => {
        if (entry.type === "tool") {
          const key = entry.tool.toolUseId || i;
          const card = renderToolCard?.(entry.tool.toolUseId);
          if (card) return <Fragment key={key}>{card}</Fragment>;
          if (entry.tool.toolName === "ask_user") {
            return <AskUserTimelineRow key={key} tool={entry.tool} />;
          }
          return <ToolTimelineRow key={key} tool={entry.tool} />;
        }
        const isLast = i === timeline.length - 1;
        return (
          <div key={`text-${i}`} className={textClass}>
            <MarkdownContent text={entry.text} />
            {active && isLast && <span className="kaboo-blink-cursor" />}
          </div>
        );
      })}
    </>
  );
}
