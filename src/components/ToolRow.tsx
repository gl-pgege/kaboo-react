import { useState } from "react";
import type { ToolCall } from "../types";
import { formatToolInput } from "../formatters/input";
import { formatToolResult, isCancelledResult } from "../formatters/output";
import { MiniTable } from "./MiniTable";

/**
 * Renders a single {@link ToolCall} as a collapsible row: status icon, label, an
 * input summary, and — when expanded — the formatted result (a {@link MiniTable}
 * for tabular JSON, otherwise text). Used inside the {@link Timeline}.
 *
 * @example
 * ```tsx
 * import { ToolRow } from "kaboo-react";
 * import type { ToolCall } from "kaboo-react";
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
export function ToolRow({ tool }: { tool: ToolCall }) {
  const [open, setOpen] = useState(false);
  const cancelled = tool.status === "cancelled" || isCancelledResult(tool.toolResult);
  const isDone = tool.status !== "running";
  const label = tool.toolLabel || tool.toolName;
  const { summary: inputSummary } = formatToolInput(tool.toolInput);

  return (
    <div className="kaboo-tool-row">
      <div className="kaboo-tool-row-header" onClick={() => setOpen(!open)}>
        {tool.status === "running" ? (
          <svg width={10} height={10} viewBox="0 0 16 16" className="kaboo-icon-shrink">
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
        ) : (
          <svg width={10} height={10} viewBox="0 0 10 10" className="kaboo-icon-shrink">
            <circle
              cx="5" cy="5" r="3"
              className={
                cancelled
                  ? "kaboo-tool-dot-cancelled"
                  : tool.status === "error"
                    ? "kaboo-tool-dot-error"
                    : "kaboo-tool-dot-success"
              }
            />
          </svg>
        )}
        <span className="kaboo-tool-row-label">{label}</span>
        {isDone && (
          <span className="kaboo-tool-row-status">
            {cancelled ? "cancelled" : tool.status === "error" ? "error" : "done"}
          </span>
        )}
        <svg
          width={14} height={14} viewBox="0 0 16 16"
          className={`kaboo-chevron ${open ? "kaboo-chevron-open" : ""}`}
        >
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {!open && inputSummary && (
        <div className="kaboo-tool-row-summary">
          {inputSummary.length > 80 ? inputSummary.slice(0, 80) + "..." : inputSummary}
        </div>
      )}

      {open && (
        <div className="kaboo-tool-row-detail">
          {inputSummary && (
            <div className="kaboo-tool-input">{inputSummary}</div>
          )}
          {tool.toolResult && <ToolResultBlock raw={tool.toolResult} cancelled={cancelled} />}
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
  const { rows, text } = formatToolResult(raw);
  if (rows) {
    return (
      <div className="kaboo-tool-result kaboo-tool-result-table">
        <MiniTable rows={rows} />
      </div>
    );
  }
  return <div className="kaboo-tool-result">{text}</div>;
}
