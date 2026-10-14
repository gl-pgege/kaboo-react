import type { ComponentType, ReactElement } from "react";
import { useInterruptBridge, type ActiveInterrupt } from "../context/InterruptBridge";
import { useInterruptRenderer } from "../context/InterruptRenderers";
import type { InterruptRendererProps } from "../types";

/**
 * One open request, rendered through the renderer registered for its kind (or
 * `Renderer` when given), or as submitted once it has been answered — by its
 * own card, Approve all, or an "Allow for this chat" covering it.
 */
export function InterruptPrompt({
  interrupt,
  Renderer: override,
}: {
  interrupt: ActiveInterrupt;
  Renderer?: ComponentType<InterruptRendererProps<any>>;
}): ReactElement {
  const { answered } = useInterruptBridge();
  const registered = useInterruptRenderer(interrupt.reason.type);
  const Renderer = override ?? registered;
  if (answered.has(interrupt.id)) {
    return <div className="kaboo-interrupt-responded">Response submitted</div>;
  }
  return (
    <Renderer
      reason={interrupt.reason}
      toolCallId={interrupt.toolCallId}
      onResolve={interrupt.onResolve}
      onCancel={interrupt.onCancel}
    />
  );
}
