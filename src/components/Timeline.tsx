import { Fragment, type ReactNode } from "react";
import type { TimelineEntry, ToolCall } from "../types";
import { ToolRow } from "./ToolRow";
import { MarkdownContent } from "./MarkdownContent";
import { AskUserRow } from "./AskUserRow";
import { useInterruptFor } from "../context/InterruptBridge";
import { InterruptPrompt } from "./InterruptPrompt";
import { useToolRenderer } from "../context/ToolRenderers";
import { resolveTimelineTool } from "../utils/timeline";

/**
 * A regular tool row that also surfaces its own approval gate inline. When a
 * gated tool is awaiting approval it has an open interrupt anchored to this
 * tool-call id; the approval prompt (or the app's own request kind raised by
 * the tool) renders directly under the row so it
 * sits at the request it governs. With N tools gated in parallel each row owns
 * its own card and resolves independently.
 *
 * A `toolRenderers` registration for this tool's name replaces the built-in
 * row with the app's custom card (the inline gate still renders under it), so
 * per-tool interactive cards apply inside activity timelines exactly as they
 * do in the chat transcript.
 */
function ToolTimelineRow({ tool }: { tool: ToolCall }) {
  const interrupt = useInterruptFor(tool.toolUseId);
  const CustomTool = useToolRenderer(tool.toolName);
  return (
    <>
      {CustomTool ? <CustomTool tool={tool} /> : <ToolRow tool={tool} />}
      {interrupt && <InterruptPrompt interrupt={interrupt} />}
    </>
  );
}

/** Props for {@link Timeline}. */
export interface TimelineProps {
  /** The interleaved text/tool entries to render, in order. */
  timeline: TimelineEntry[];
  /**
   * The owning group's tool calls. Timeline tool entries reference these by
   * `toolUseId` rather than embedding them, so they are needed to render a
   * tool row.
   */
  tools: ToolCall[];
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
export function Timeline({
  timeline,
  tools,
  active,
  variant = "card",
  renderToolCard,
}: TimelineProps) {
  const textClass =
    variant === "drill" ? "kaboo-drill-tokens-content" : "kaboo-agent-card-tokens";

  return (
    <>
      {timeline.map((entry, i) => {
        if (entry.type === "tool") {
          const tool = resolveTimelineTool(entry, tools);
          if (!tool) return null;
          const key = tool.toolUseId || i;
          const card = renderToolCard?.(tool.toolUseId);
          if (card) return <Fragment key={key}>{card}</Fragment>;
          if (tool.toolName === "ask_user") {
            return <AskUserRow key={key} tool={tool} />;
          }
          return <ToolTimelineRow key={key} tool={tool} />;
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
