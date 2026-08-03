import { createContext, useContext, type ComponentType, type ReactNode } from "react";
import { InterruptRenderer } from "../components/InterruptRenderer";
import type { InterruptReason, InterruptRendererProps } from "../types";

/** Per-interrupt-type renderer overrides, keyed by `reason.type`. */
export type InterruptRenderers = Partial<
  Record<InterruptReason["type"], ComponentType<InterruptRendererProps>>
>;

const InterruptRenderersContext = createContext<InterruptRenderers>({});

/**
 * Makes the app's `interruptRenderers` overrides available to every surface
 * that renders an interrupt prompt — the chat-level slot, a Timeline's inline
 * tool anchor, and the wildcard tool row — so a custom card applies uniformly
 * no matter where the gate is anchored. Included automatically by
 * {@link KabooProvider}.
 */
export function InterruptRenderersProvider({
  renderers,
  children,
}: {
  renderers?: InterruptRenderers;
  children: ReactNode;
}) {
  return (
    <InterruptRenderersContext.Provider value={renderers ?? {}}>
      {children}
    </InterruptRenderersContext.Provider>
  );
}

/**
 * The renderer for a given interrupt reason type: the app's override when one
 * was provided, otherwise the built-in {@link InterruptRenderer}.
 */
export function useInterruptRenderer(
  type: InterruptReason["type"],
): ComponentType<InterruptRendererProps> {
  const renderers = useContext(InterruptRenderersContext);
  return renderers[type] ?? InterruptRenderer;
}
