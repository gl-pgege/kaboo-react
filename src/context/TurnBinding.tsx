import { createContext, useContext, type ReactNode } from "react";
import type { GroupEntry } from "../utils/groups";

/**
 * Binds each assistant reply message to the swarm/graph member cards its turn
 * produced, so those cards render *inside* that message (above its reply text)
 * in one chronological block — and a turn's cards never bleed onto a different
 * turn's reply.
 *
 * The mapping is by turn, not `runId`: an interrupt/resume changes the `runId`
 * mid-turn, so a reply's `runId` may only match the `chat_output` member while
 * earlier members carry the pre-resume `runId`. Both, however, share the
 * server-stamped `turnId` ({@link groupTurnKey}). {@link KabooMessageView}
 * resolves each reply message → its run → that run's `turnId`, then collects all
 * roots of that turn — so every member binds to the right reply regardless of
 * how many runs the turn spanned.
 *
 * `rootsByMessageId` holds the resolved cards per assistant message id; a turn
 * whose reply hasn't streamed yet isn't in the map — {@link KabooMessageView}
 * renders those roots live beneath the transcript instead.
 */
export interface TurnBinding {
  rootsByMessageId: Map<string, GroupEntry[]>;
  /**
   * ALL activity groups of a settled turn (roots and nested members alike),
   * keyed by the turn's *final* assistant message id. This is the turn-footer
   * anchor: a slot rendered after that message can inspect everything the turn
   * produced (e.g. structured outputs on nested visualizer groups) without
   * knowing how work was delegated. Empty for turns still streaming.
   */
  turnGroupsByMessageId: Map<string, GroupEntry[]>;
}

const EMPTY_BINDING: TurnBinding = {
  rootsByMessageId: new Map(),
  turnGroupsByMessageId: new Map(),
};

const TurnBindingContext = createContext<TurnBinding>(EMPTY_BINDING);

export function TurnBindingProvider({
  value,
  children,
}: {
  value: TurnBinding;
  children: ReactNode;
}) {
  return (
    <TurnBindingContext.Provider value={value}>
      {children}
    </TurnBindingContext.Provider>
  );
}

export function useTurnBinding(): TurnBinding {
  return useContext(TurnBindingContext);
}

/**
 * All activity groups of the turn anchored on `messageId` (the turn's final
 * assistant message), or an empty array for any other message. Lets custom
 * surfaces implement their own end-of-turn presentation from the same binding
 * the built-in `turnFooter` slot uses.
 *
 * @example
 * ```tsx
 * import { useTurnGroups } from "@pgege/kaboo-react";
 *
 * function TurnToolCount({ messageId }: { messageId: string }) {
 *   const groups = useTurnGroups(messageId);
 *   return <span>{groups.reduce((n, [, g]) => n + g.tools.length, 0)}</span>;
 * }
 * ```
 */
export function useTurnGroups(messageId: string | undefined): GroupEntry[] {
  const { turnGroupsByMessageId } = useTurnBinding();
  return (messageId ? turnGroupsByMessageId.get(messageId) : undefined) ?? [];
}
