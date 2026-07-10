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
}

const TurnBindingContext = createContext<TurnBinding>({
  rootsByMessageId: new Map(),
});

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
