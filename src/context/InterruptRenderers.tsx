import { createContext, useContext, type ComponentType, type ReactNode } from "react";
import { InterruptRenderer } from "../components/InterruptRenderer";
import type { ApprovalScope, InterruptRendererProps } from "../types";

/**
 * Interrupt renderer overrides, keyed by the request's `reason.type`: the
 * built-in `approval` and `form`, or an app's own kind such as `files`.
 */
export type InterruptRenderers = Record<
  string,
  ComponentType<InterruptRendererProps<any>> | undefined
>;

const ALL_SCOPES: readonly ApprovalScope[] = ["once", "thread", "always"];

interface InterruptSettings {
  renderers: InterruptRenderers;
  approvalScopes: readonly ApprovalScope[];
}

const InterruptRenderersContext = createContext<InterruptSettings>({
  renderers: {},
  approvalScopes: ALL_SCOPES,
});

/**
 * Makes the app's `interruptRenderers` overrides available to every surface
 * that renders an interrupt prompt — the chat-level slot, a Timeline's inline
 * tool anchor, and the wildcard tool row — so a custom card applies uniformly
 * no matter where the gate is anchored. Also carries `approvalScopes`, the
 * approval options the app allows. Included automatically by
 * {@link KabooProvider}.
 *
 * @example
 * ```tsx
 * import { InterruptRenderersProvider } from "@pgege/kaboo-react";
 *
 * function Providers({ children }: { children: React.ReactNode }) {
 *   return (
 *     <InterruptRenderersProvider approvalScopes={["once", "thread"]}>
 *       {children}
 *     </InterruptRenderersProvider>
 *   );
 * }
 * ```
 */
export function InterruptRenderersProvider({
  renderers,
  approvalScopes,
  children,
}: {
  renderers?: InterruptRenderers;
  /**
   * The approval scopes the app allows. A request offers only the scopes both
   * the agent and the app allow; `once` is always offered. Defaults to all.
   */
  approvalScopes?: readonly ApprovalScope[];
  children: ReactNode;
}) {
  return (
    <InterruptRenderersContext.Provider
      value={{ renderers: renderers ?? {}, approvalScopes: approvalScopes ?? ALL_SCOPES }}
    >
      {children}
    </InterruptRenderersContext.Provider>
  );
}

/**
 * The renderer for a request kind: the app's override when one was provided,
 * otherwise the built-in {@link InterruptRenderer} (approval and question
 * cards, and a minimal card for any other kind).
 *
 * @example
 * ```tsx
 * import { useInterruptRenderer, type InterruptReason } from "@pgege/kaboo-react";
 *
 * function Prompt({ reason }: { reason: InterruptReason }) {
 *   const Renderer = useInterruptRenderer(reason.type);
 *   return <Renderer reason={reason} onResolve={() => {}} onCancel={() => {}} />;
 * }
 * ```
 */
export function useInterruptRenderer(
  type: string,
): ComponentType<InterruptRendererProps<any>> {
  const { renderers } = useContext(InterruptRenderersContext);
  return renderers[type] ?? InterruptRenderer;
}

/**
 * The approval scopes the app allows (`approvalScopes` on
 * {@link KabooProvider}), for custom approval cards.
 *
 * @example
 * ```tsx
 * import { useApprovalScopes } from "@pgege/kaboo-react";
 *
 * function RememberHint() {
 *   const scopes = useApprovalScopes();
 *   return scopes.includes("always") ? <span>Decisions can be remembered</span> : null;
 * }
 * ```
 */
export function useApprovalScopes(): readonly ApprovalScope[] {
  return useContext(InterruptRenderersContext).approvalScopes;
}
