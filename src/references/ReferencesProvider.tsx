import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import type { PendingReference } from "./serialize";
import { objectToStateEntry, withReferenceState } from "./serialize";
import type { ReferenceProvider } from "./types";

/** Value exposed by {@link useReferences}. */
export interface ReferencesContextValue {
  /** Registered `@` providers (upload built-in + app-defined). */
  providers: ReferenceProvider[];
  /** References currently staged on the composer. */
  pending: PendingReference[];
  /** Stage a reference (deduped by id). */
  addReference: (ref: PendingReference) => void;
  /** Remove a staged reference by id. */
  removeReference: (id: string) => void;
  /** Clear all staged references (call after a message is sent). */
  clearReferences: () => void;
  /**
   * Object references sent with each user message, keyed by message id. Object
   * references ride `state.kaboo_references` rather than the message content, so
   * they'd otherwise be invisible in the sent bubble — this lets the user
   * message renderer show them as chips.
   */
  messageReferences: Record<string, PendingReference[]>;
  /** Record the object references attached to a sent user message. */
  recordMessageReferences: (messageId: string, refs: PendingReference[]) => void;
}

const ReferencesContext = createContext<ReferencesContextValue>({
  providers: [],
  pending: [],
  addReference: () => {},
  removeReference: () => {},
  clearReferences: () => {},
  messageReferences: {},
  recordMessageReferences: () => {},
});

/** Props for {@link ReferencesProvider}. */
export interface ReferencesProviderProps {
  /** The `@` provider registry. File upload is not implicit — pass `uploadProvider()`. */
  providers?: ReferenceProvider[];
  /**
   * Sync staged object-transport references into the bound agent's
   * `state.kaboo_references` as they change, so a plain `<CopilotChat>` send
   * still carries them. Default `true`. Attachment references travel on the
   * message itself and are unaffected.
   */
  syncObjectStateTo?: string | false;
  /** The subtree that can stage and read references. */
  children: ReactNode;
}

/**
 * Holds the `@` reference registry and the composer's staged references, and
 * (by default) mirrors object references into the agent's AG-UI state. Mounted
 * automatically by {@link KabooProvider}; read it via {@link useReferences}.
 */
export function ReferencesProvider({
  providers = [],
  syncObjectStateTo = false,
  children,
}: ReferencesProviderProps) {
  const [pending, setPending] = useState<PendingReference[]>([]);
  const [messageReferences, setMessageReferences] = useState<
    Record<string, PendingReference[]>
  >({});

  const addReference = useCallback((ref: PendingReference) => {
    setPending((prev) =>
      prev.some((r) => r.id === ref.id) ? prev : [...prev, ref],
    );
  }, []);
  const removeReference = useCallback((id: string) => {
    setPending((prev) => prev.filter((r) => r.id !== id));
  }, []);
  const clearReferences = useCallback(() => setPending([]), []);
  const recordMessageReferences = useCallback(
    (messageId: string, refs: PendingReference[]) => {
      if (refs.length === 0) return;
      setMessageReferences((prev) => ({ ...prev, [messageId]: refs }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      providers,
      pending,
      addReference,
      removeReference,
      clearReferences,
      messageReferences,
      recordMessageReferences,
    }),
    [
      providers,
      pending,
      addReference,
      removeReference,
      clearReferences,
      messageReferences,
      recordMessageReferences,
    ],
  );

  return (
    <ReferencesContext.Provider value={value}>
      {syncObjectStateTo !== false && (
        <ReferenceStateSync agentId={syncObjectStateTo} pending={pending} />
      )}
      {children}
    </ReferencesContext.Provider>
  );
}

/**
 * Mirrors staged object-transport references into the bound agent's
 * `state.kaboo_references`. Mounted by {@link ReferencesProvider} when
 * `syncObjectStateTo` is set.
 */
export function ReferenceStateSync({
  agentId,
  pending,
}: {
  agentId?: string;
  pending: PendingReference[];
}): null {
  const { agent } = useAgent(agentId ? { agentId } : undefined);
  const objectRefs = useMemo(
    () =>
      pending
        .filter((r): r is Extract<PendingReference, { transport: "object" }> => r.transport === "object")
        .map(objectToStateEntry),
    [pending],
  );
  const key = JSON.stringify(objectRefs);
  useEffect(() => {
    if (!agent || typeof agent.setState !== "function") return;
    agent.setState(withReferenceState(agent.state as Record<string, unknown>, objectRefs));
    // key drives the effect; agent.state is read fresh above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent, key]);
  return null;
}

/**
 * Access the `@` reference registry and staged references.
 *
 * @example
 * ```tsx
 * const { providers, pending, addReference } = useReferences();
 * ```
 */
export function useReferences(): ReferencesContextValue {
  return useContext(ReferencesContext);
}
