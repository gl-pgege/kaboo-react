import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { InterruptReason } from "../types";

export interface ActiveInterrupt {
  /**
   * Unique interrupt id (from the AG-UI interrupt). Distinguishes concurrent
   * gates that may share a single tool-call id (e.g. two parallel sub-agent
   * gates re-keyed onto one delegating call), so each resolves independently.
   */
  id: string;
  reason: InterruptReason;
  onResolve: (payload: unknown) => void;
  onCancel: () => void;
  /**
   * The originating tool-call id, when the interrupt was raised by a tool (e.g.
   * `ask_user` or a gated tool). Lets the owning agent card render the live
   * prompt inline at its tool-call position, so the prompt sits in chronological
   * order rather than in a separate top-level slot.
   */
  toolCallId?: string;
}

interface InterruptBridgeValue {
  /** Every open interrupt from the current run, in emission order. */
  active: ActiveInterrupt[];
  publish: (interrupts: ActiveInterrupt[]) => void;
}

const InterruptBridgeContext = createContext<InterruptBridgeValue>({
  active: [],
  publish: () => {},
});

export function InterruptBridgeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveInterrupt[]>([]);
  const publish = useCallback((interrupts: ActiveInterrupt[]) => {
    setActive(interrupts);
  }, []);

  return (
    <InterruptBridgeContext.Provider value={{ active, publish }}>
      {children}
    </InterruptBridgeContext.Provider>
  );
}

export function useInterruptBridge() {
  return useContext(InterruptBridgeContext);
}

/**
 * The first open interrupt anchored to a given tool-call id, or `undefined`.
 * Lets a tool row claim and render its own gate inline while N concurrent gates
 * are open, each anchored to a distinct tool call.
 */
export function useInterruptFor(
  toolCallId: string | undefined,
): ActiveInterrupt | undefined {
  const { active } = useInterruptBridge();
  if (!toolCallId) return undefined;
  return active.find((i) => i.toolCallId === toolCallId);
}

/**
 * Publishes the current set of open interrupts to the bridge so each owning
 * agent card can render its prompt inline at the matching tool-call position.
 * CopilotKit surfaces every open interrupt at once, so this takes the full list
 * and keeps the latest resolve/cancel callbacks in a ref — their per-render
 * identity churn must not re-publish (only the interrupt set should).
 */
export function InterruptBridgePublisher({
  interrupts,
}: {
  interrupts: ActiveInterrupt[];
}): null {
  const { publish } = useInterruptBridge();
  const listRef = useRef(interrupts);
  listRef.current = interrupts;

  const key = interrupts
    .map((i) => `${i.id}:${i.toolCallId ?? ""}:${JSON.stringify(i.reason)}`)
    .join("|");

  useEffect(() => {
    publish(
      listRef.current.map((i) => ({
        id: i.id,
        reason: i.reason,
        toolCallId: i.toolCallId,
        onResolve: (payload: unknown) =>
          listRef.current.find((x) => x.id === i.id)?.onResolve(payload),
        onCancel: () => listRef.current.find((x) => x.id === i.id)?.onCancel(),
      })),
    );
    return () => publish([]);
  }, [key, publish]);

  return null;
}
