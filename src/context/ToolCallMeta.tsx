import { createContext, useContext } from "react";
import type { ToolCall } from "../types";
import { isCancelledResult } from "../formatters/output";

export interface ToolCallMeta {
  status: "running" | "success" | "error" | "cancelled";
  label?: string;
  error?: string;
  fix?: string;
  startedAt?: number;
  endedAt?: number;
  toolCallId: string;
  agentName?: string;
}

export const ToolCallMetaContext = createContext<ToolCallMeta | null>(null);

export function useToolCallMeta(): ToolCallMeta | null {
  return useContext(ToolCallMetaContext);
}

export function toolCallStatus(tool: ToolCall): ToolCallMeta["status"] {
  if (tool.status === "running" || tool.status === "error") return tool.status;
  return tool.status === "cancelled" || isCancelledResult(tool.toolResult) ? "cancelled" : "success";
}

export function toolCallMeta(tool: ToolCall, agentName?: string): ToolCallMeta {
  return {
    status: toolCallStatus(tool),
    label: tool.toolLabel,
    error: tool.error,
    fix: tool.fix,
    startedAt: tool.startedAt,
    endedAt: tool.endedAt,
    toolCallId: tool.toolUseId,
    agentName,
  };
}
