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

/**
 * An open interrupt published onto the InterruptBridge so an owning agent card
 * can render its prompt inline (rather than only in the chat slot). Carries the
 * reason plus resolve/cancel callbacks bound to this specific interrupt id.
 */
export interface ActiveInterrupt {
  /**
   * Unique interrupt id (from the AG-UI interrupt). Distinguishes concurrent
   * gates that may share a single tool-call id (e.g. two parallel sub-agent
   * gates re-keyed onto one delegating call), so each resolves independently.
   */
  id: string;
  /** Why the run paused, and what input it needs. */
  reason: InterruptReason;
  /** Resume the run with the user's answer/approval payload. */
  onResolve: (payload: unknown) => void;
  /** Cancel/reject this gate, resuming the run without a positive answer. */
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

/**
 * Holds the set of currently open interrupts so any tool row can claim and
 * render its own gate inline (see {@link useInterruptFor}). Included
 * automatically by {@link KabooProvider}.
 *
 * @example
 * ```tsx
 * import { InterruptBridgeProvider } from "@pgege/kaboo-react";
 *
 * function Providers({ children }: { children: React.ReactNode }) {
 *   return <InterruptBridgeProvider>{children}</InterruptBridgeProvider>;
 * }
 * ```
 */
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

/**
 * Reads the InterruptBridge: the list of open interrupts plus `publish`. Most
 * consumers want {@link useInterruptFor} instead; use this to inspect or drive
 * the whole set.
 *
 * @example
 * ```tsx
 * import { useInterruptBridge } from "@pgege/kaboo-react";
 *
 * function OpenGateCount() {
 *   const { active } = useInterruptBridge();
 *   return <span>{active.length} open</span>;
 * }
 * ```
 */
export function useInterruptBridge(): {
  /** Every open interrupt from the current run, in emission order. */
  active: ActiveInterrupt[];
  /** Replace the set of interrupts published to the bridge. */
  publish: (interrupts: ActiveInterrupt[]) => void;
} {
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
