import { useState, type ReactNode } from "react";
import type { ToolCall } from "../types";
import { formatToolInput } from "../formatters/input";
import { formatToolResult } from "../formatters/output";
import { parseToolValue, toolTitle } from "../formatters/value";
import { toolCallStatus, type ToolCallMeta } from "../context/ToolCallMeta";
import { ValueView } from "./ValueView";

function formatDuration(startedAt?: number, endedAt?: number): string | null {
  if (startedAt == null || endedAt == null || endedAt < startedAt) return null;
  const ms = endedAt - startedAt;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.floor((ms % 60_000) / 1000)}s`;
}

export function ToolStatusIcon({ status }: { status: ToolCallMeta["status"] }) {
  if (status === "running") {
    return (
      <svg width={12} height={12} viewBox="0 0 16 16" className="kaboo-icon-shrink">
        <circle
          cx="8" cy="8" r="5"
          fill="none" className="kaboo-tool-spinner" strokeWidth="2"
          strokeDasharray="22" strokeDashoffset="6"
        >
          <animateTransform
            attributeName="transform" type="rotate"
            from="0 8 8" to="360 8 8" dur="0.8s" repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  }
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" className={`kaboo-icon-shrink kaboo-tool-dot-${status}`} role="img" aria-label={status}>
      {status === "success" ? (
        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : status === "error" ? (
        <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4.5 11.5l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" className={`kaboo-chevron ${open ? "kaboo-chevron-open" : ""}`}>
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16">
      <path d="M3 4.5l3.5 3.5L3 11.5M8.5 11.5H13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Renders a single {@link ToolCall} as a collapsible row: status icon, label (the
 * tool's name read as words when it has no label), an input summary, and — when
 * expanded — the input and result laid out as fields and tables, never JSON.
 * Used inside the {@link Timeline}.
 *
 * @example
 * ```tsx
 * import { ToolRow } from "@pgege/kaboo-react";
 * import type { ToolCall } from "@pgege/kaboo-react";
 *
 * const tool: ToolCall = {
 *   toolUseId: "t1",
 *   toolName: "run_sql",
 *   toolInput: { query: "select 1" },
 *   status: "done",
 * };
 *
 * function Example() {
 *   return <ToolRow tool={tool} />;
 * }
 * ```
 */
export function ToolRow({ tool, icon }: { tool: ToolCall; icon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const status = toolCallStatus(tool);
  const label = tool.toolLabel || toolTitle(tool.toolName);
  const { summary } = formatToolInput(tool.toolInput);
  const duration = status === "running" ? null : formatDuration(tool.startedAt, tool.endedAt);

  return (
    <div className={`kaboo-tool-row kaboo-tool-row-${status}`}>
      <button type="button" className="kaboo-tool-row-header" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="kaboo-tool-row-icon">{icon ?? <ToolIcon />}</span>
        <span className="kaboo-tool-row-label">{label}</span>
        <span className="kaboo-tool-row-summary">{summary}</span>
        <ToolStatusIcon status={status} />
        {(status === "error" || status === "cancelled") && <span className="kaboo-tool-row-status">{status}</span>}
        {duration && <span className="kaboo-tool-row-duration">{duration}</span>}
        <Chevron open={open} />
      </button>

      {open && (
        <div className="kaboo-tool-row-detail">
          {tool.error && (
            <div className="kaboo-tool-error">
              <div>{tool.error}</div>
              {tool.fix && <div className="kaboo-tool-fix">{tool.fix}</div>}
            </div>
          )}
          {summary && (
            <div className="kaboo-tool-input">
              <ValueView value={tool.toolInput} />
            </div>
          )}
          {tool.toolResult && <ToolResultBlock raw={tool.toolResult} cancelled={status === "cancelled"} />}
        </div>
      )}
    </div>
  );
}

function ToolResultBlock({ raw, cancelled }: { raw: string; cancelled?: boolean }) {
  if (cancelled) {
    const { text } = formatToolResult(raw);
    const message = /user (rejected|declined)/i.test(text) ? text : "Declined by user.";
    return <div className="kaboo-tool-result kaboo-tool-result-cancelled">{message}</div>;
  }
  const value = parseToolValue(raw);
  if (value === undefined || typeof value === "string") {
    return <div className="kaboo-tool-result">{value ?? raw}</div>;
  }
  return (
    <div className="kaboo-tool-result kaboo-tool-result-value">
      <ValueView value={value} />
    </div>
  );
}
