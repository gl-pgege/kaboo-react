import { Fragment, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { useRenderToolCall } from "@copilotkit/react-core/v2";
import { CopilotKitContext } from "@copilotkit/react-core/v2/context";
import type { TimelineEntry, ToolCall } from "../types";
import { ToolRow } from "./ToolRow";
import { MarkdownContent } from "./MarkdownContent";
import { AskUserRow } from "./AskUserRow";
import { useToolRenderer } from "../context/ToolRenderers";
import { useActivity } from "../hooks/useActivity";
import { resolveTimelineTool } from "../utils/timeline";
import { SURFACE_TOOLS } from "../utils/surfaces";

type RenderToolCallInput = Parameters<ReturnType<typeof useRenderToolCall>>[0];

const NO_RENDERERS: readonly { name: string }[] = [];

function useRegisteredRenderer(tool: ToolCall): boolean {
  const copilotkit = useContext(CopilotKitContext)?.copilotkit;
  const { groups } = useActivity();
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!copilotkit) return () => {};
      const subscription = copilotkit.subscribe({ onRenderToolCallsChanged: onChange });
      return () => subscription.unsubscribe();
    },
    [copilotkit],
  );
  const renderers = useSyncExternalStore(subscribe, () => copilotkit?.renderToolCalls ?? NO_RENDERERS);
  const startsAgent = Object.values(groups).some((group) => group.toolCallId === tool.toolUseId);
  return !startsAgent && renderers.some((renderer) => renderer.name === tool.toolName);
}

function RegisteredToolCall({ tool }: { tool: ToolCall }) {
  const renderToolCall = useRenderToolCall();
  const input: RenderToolCallInput = {
    toolCall: {
      id: tool.toolUseId,
      type: "function",
      function: { name: tool.toolName, arguments: JSON.stringify(tool.toolInput ?? {}) },
    },
    ...(tool.toolResult === undefined
      ? {}
      : { toolMessage: { id: `${tool.toolUseId}:result`, role: "tool", toolCallId: tool.toolUseId, content: tool.toolResult } }),
  };
  return renderToolCall(input);
}

/**
 * A tool call drawn by the renderer the app registered with CopilotKit for its
 * name (`useRenderTool`), so a tool looks the same in the chat and inside agent
 * cards; otherwise the app's `toolRenderers` card, or the built-in tool row.
 */
function ToolTimelineRow({ tool }: { tool: ToolCall }) {
  const registered = useRegisteredRenderer(tool);
  const CustomTool = useToolRenderer(tool.toolName);
  if (registered) return <RegisteredToolCall tool={tool} />;
  return CustomTool ? <CustomTool tool={tool} /> : <ToolRow tool={tool} />;
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
          if (!tool || SURFACE_TOOLS.has(tool.toolName)) return null;
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
