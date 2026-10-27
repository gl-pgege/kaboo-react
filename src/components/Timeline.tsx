import { Fragment, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRenderToolCall } from "@copilotkit/react-core/v2";
import { CopilotKitContext } from "@copilotkit/react-core/v2/context";
import type { TimelineEntry, ToolCall } from "../types";
import { Chevron, ToolRow, ToolStatusIcon } from "./ToolRow";
import { MarkdownContent } from "./MarkdownContent";
import { AskUserRow } from "./AskUserRow";
import { AgentCard } from "./AgentCard";
import { useRenderOptions, useToolRenderer } from "../context/ToolRenderers";
import { ToolCallMetaContext, toolCallMeta, toolCallStatus } from "../context/ToolCallMeta";
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
    ...(tool.status === "running"
      ? {}
      : {
          toolMessage: {
            id: `${tool.toolUseId}:result`,
            role: "tool",
            toolCallId: tool.toolUseId,
            content: tool.toolResult ?? tool.error ?? "",
          },
        }),
  };
  return renderToolCall(input);
}

/**
 * A tool call drawn by the renderer the app registered with CopilotKit for its
 * name (`useRenderTool`), so a tool looks the same in the chat and inside agent
 * cards; otherwise the app's `toolRenderers` card, the card of the sub-agent
 * the call started, or the fallback tool row.
 */
function ToolTimelineRow({ tool, agentName }: { tool: ToolCall; agentName?: string }) {
  const registered = useRegisteredRenderer(tool);
  const CustomTool = useToolRenderer(tool.toolName);
  const Fallback = useRenderOptions().fallbackToolRenderer ?? ToolRow;
  const { groups } = useActivity();
  const meta = useMemo(() => toolCallMeta(tool, agentName), [tool, agentName]);
  const started = Object.entries(groups).find(([, group]) => group.toolCallId === tool.toolUseId);
  return (
    <ToolCallMetaContext.Provider value={meta}>
      {registered ? (
        <RegisteredToolCall tool={tool} />
      ) : CustomTool ? (
        <CustomTool tool={tool} />
      ) : started ? (
        <AgentCard groupId={started[0]} group={started[1]} />
      ) : (
        <Fallback tool={tool} />
      )}
    </ToolCallMetaContext.Provider>
  );
}

function ReadGroup({ tools, agentName }: { tools: ToolCall[]; agentName?: string }) {
  const [open, setOpen] = useState(false);
  const statuses = tools.map(toolCallStatus);
  const running = statuses.includes("running");
  const failed = statuses.filter((status) => status === "error").length;
  const label = running
    ? `Reading ${tools.length} items`
    : `Read ${tools.length} items${failed > 0 ? `, ${failed} failed` : ""}`;
  return (
    <div className="kaboo-tool-row kaboo-tool-group">
      <button type="button" className="kaboo-tool-row-header" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="kaboo-tool-row-icon">
          <svg width={12} height={12} viewBox="0 0 16 16">
            <path d="M3 4h10M3 8h10M3 12h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="kaboo-tool-row-label">{label}</span>
        <span className="kaboo-tool-row-summary" />
        <ToolStatusIcon
          status={
            running ? "running" : failed > 0 ? "error" : statuses.every((status) => status === "cancelled") ? "cancelled" : "success"
          }
        />
        <Chevron open={open} />
      </button>
      {open && (
        <div className="kaboo-tool-group-items">
          {tools.map((tool) => (
            <ToolTimelineRow key={tool.toolUseId} tool={tool} agentName={agentName} />
          ))}
        </div>
      )}
    </div>
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
  agentName?: string;
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
  agentName,
}: TimelineProps) {
  const { isReadOnlyTool } = useRenderOptions();
  const textClass =
    variant === "drill" ? "kaboo-drill-tokens-content" : "kaboo-agent-card-tokens";

  const items: ReactNode[] = [];
  let reads: ToolCall[] = [];
  const flushReads = () => {
    if (reads.length > 1) {
      items.push(<ReadGroup key={`reads-${reads[0].toolUseId}`} tools={reads} agentName={agentName} />);
    } else if (reads.length === 1) {
      items.push(<ToolTimelineRow key={reads[0].toolUseId} tool={reads[0]} agentName={agentName} />);
    }
    reads = [];
  };

  timeline.forEach((entry, i) => {
    if (entry.type === "text") {
      flushReads();
      items.push(
        <div key={`text-${i}`} className={textClass}>
          <MarkdownContent text={entry.text} />
          {active && i === timeline.length - 1 && <span className="kaboo-blink-cursor" />}
        </div>,
      );
      return;
    }
    const tool = resolveTimelineTool(entry, tools);
    if (!tool || SURFACE_TOOLS.has(tool.toolName)) return;
    const card = renderToolCard?.(tool.toolUseId);
    if (!card && tool.toolName !== "ask_user" && isReadOnlyTool?.(tool.toolName)) {
      reads.push(tool);
      return;
    }
    flushReads();
    const key = tool.toolUseId || i;
    if (card) items.push(<Fragment key={key}>{card}</Fragment>);
    else if (tool.toolName === "ask_user") items.push(<AskUserRow key={key} tool={tool} />);
    else items.push(<ToolTimelineRow key={key} tool={tool} agentName={agentName} />);
  });
  flushReads();

  return <>{items}</>;
}
