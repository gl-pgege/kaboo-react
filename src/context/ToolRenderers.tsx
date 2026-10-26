import { createContext, useContext, useMemo, type ComponentType, type ReactNode } from "react";
import type { ToolCall } from "../types";
import type { KabooProviderProps } from "./KabooProvider";

/**
 * Props for a custom per-tool-name renderer supplied via `toolRenderers`.
 * Receives the full {@link ToolCall} so a rich card can render the input,
 * the result, and its own interactive state at the tool's chronological
 * position inside a Timeline.
 */
export interface ToolRendererProps {
  /** The tool call being rendered. */
  tool: ToolCall;
}

/**
 * Per-tool-name renderer overrides, keyed by the exact tool name (e.g.
 * `create_work_item`). A registered renderer replaces the built-in
 * {@link ToolRow} for that tool everywhere a {@link Timeline} draws it —
 * top-level agent cards, nested drill views, and sub-agent activity — so
 * interactive tool cards look the same at every depth.
 */
export type ToolRenderers = Record<string, ComponentType<ToolRendererProps>>;

type RenderOptions = Pick<
  KabooProviderProps,
  "fallbackToolRenderer" | "markdownRenderer" | "renderAgentResult" | "isReadOnlyTool"
>;

const ToolRenderersContext = createContext<RenderOptions & { renderers: ToolRenderers }>({ renderers: {} });

/**
 * Makes the app's `toolRenderers` overrides available to every Timeline
 * surface. Included automatically by {@link KabooProvider}; mount it manually
 * only when composing kaboo contexts yourself.
 */
export function ToolRenderersProvider({
  renderers,
  fallbackToolRenderer,
  markdownRenderer,
  renderAgentResult,
  isReadOnlyTool,
  children,
}: Pick<KabooProviderProps, "fallbackToolRenderer" | "markdownRenderer" | "renderAgentResult" | "isReadOnlyTool"> & {
  renderers?: ToolRenderers;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ renderers: renderers ?? {}, fallbackToolRenderer, markdownRenderer, renderAgentResult, isReadOnlyTool }),
    [renderers, fallbackToolRenderer, markdownRenderer, renderAgentResult, isReadOnlyTool],
  );
  return (
    <ToolRenderersContext.Provider value={value}>
      {children}
    </ToolRenderersContext.Provider>
  );
}

/**
 * The custom renderer registered for a tool name, or `null` when the built-in
 * tool row should render.
 */
export function useToolRenderer(
  toolName: string,
): ComponentType<ToolRendererProps> | null {
  return useContext(ToolRenderersContext).renderers[toolName] ?? null;
}

export function useRenderOptions(): RenderOptions {
  return useContext(ToolRenderersContext);
}
