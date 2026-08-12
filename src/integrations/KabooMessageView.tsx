import {
  CopilotChatMessageView,
  CopilotChatAssistantMessage,
  CopilotChatUserMessage,
  useCopilotKit,
  useCopilotChatConfiguration,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { useActivity } from "../hooks/useActivity";
import { AgentCard } from "../components/AgentCard";
import { chatRootGroups, groupTurnKey, type GroupEntry } from "../utils/groups";
import { useMessageMeta } from "../context/MessageMeta";
import { TurnBindingProvider } from "../context/TurnBinding";
import { useKabooSlots, type KabooSlots } from "../context/KabooSlots";
import { KabooAssistantMessage } from "./KabooAssistantMessage";
import { KabooUserMessage } from "./KabooUserMessage";

/** Props for {@link KabooMessageView}: CopilotKit's message-view props plus per-view slot overrides. */
export interface KabooMessageViewProps extends CopilotChatMessageViewProps {
  /**
   * Per-view {@link KabooSlots} overrides. Merged over the slots provided on
   * `KabooProvider`; individual keys win over the provider's.
   */
  slots?: KabooSlots;
}

function KabooMessageViewImpl({ slots: slotOverrides, ...props }: KabooMessageViewProps) {
  const { groups } = useActivity();
  const { copilotkit } = useCopilotKit();
  const messageMeta = useMessageMeta();
  const config = useCopilotChatConfiguration();
  const contextSlots = useKabooSlots();
  const slots = { ...contextSlots, ...slotOverrides };
  const agentId = config?.agentId;
  const threadId = config?.threadId;

  return (
    <CopilotChatMessageView
      {...props}
      assistantMessage={
        KabooAssistantMessage as unknown as typeof CopilotChatAssistantMessage
      }
      userMessage={KabooUserMessage as unknown as typeof CopilotChatUserMessage}
    >
      {({ messages, messageElements, interruptElement, isRunning }) => {
        const roots = chatRootGroups(groups);

        // Bucket this turn's member cards by their stable turn key, and map each
        // AG-UI run to its turn key so a reply (whose run may be the post-resume
        // one) resolves to the whole turn — not just its chat_output member.
        const rootsByTurn = new Map<string, GroupEntry[]>();
        for (const entry of roots) {
          const key = groupTurnKey(entry[1]);
          if (!key) continue;
          const bucket = rootsByTurn.get(key);
          if (bucket) bucket.push(entry);
          else rootsByTurn.set(key, [entry]);
        }
        const runToTurn = new Map<string, string>();
        for (const g of Object.values(groups)) {
          const key = groupTurnKey(g);
          if (g.runId && key) runToTurn.set(g.runId, key);
        }

        // Resolve each assistant reply → its run → its turn's roots. A turn
        // whose reply hasn't streamed yet stays unbound and renders live below.
        const rootsByMessageId = new Map<string, GroupEntry[]>();
        const boundTurns = new Set<string>();
        // The LAST assistant message of each turn, in transcript order — the
        // anchor for the turn footer slot and `useTurnGroups`.
        const lastMessageOfTurn = new Map<string, string>();
        const list = messages as Array<{ id?: string; role?: string }>;
        for (const m of list) {
          if (m?.role !== "assistant" || !m.id) continue;
          // Prefer the run id recovered from the event stream: it is correct
          // on replay too, where CopilotKit's registry attributes every
          // replayed message to the synthetic connect run and the turn
          // binding (inline cards, turn footer) would silently come apart.
          const runId =
            messageMeta[m.id]?.runId ??
            (agentId && threadId
              ? copilotkit.getRunIdForMessage(agentId, threadId, m.id)
              : undefined);
          const key = runId ? runToTurn.get(runId) ?? runId : undefined;
          if (!key) continue;
          lastMessageOfTurn.set(key, m.id);
          const turnRoots = rootsByTurn.get(key);
          if (turnRoots) {
            rootsByMessageId.set(m.id, turnRoots);
            boundTurns.add(key);
          }
        }

        // Every group of the turn (roots AND nested members), keyed by the
        // turn's final assistant message, so end-of-turn surfaces can see
        // structured outputs regardless of how deep the producing agent sat.
        const turnGroupsByMessageId = new Map<string, GroupEntry[]>();
        for (const [key, messageId] of lastMessageOfTurn) {
          const entries = Object.entries(groups).filter(
            ([, g]) => groupTurnKey(g) === key,
          ) as GroupEntry[];
          if (entries.length > 0) turnGroupsByMessageId.set(messageId, entries);
        }

        const pending = roots.filter(([, g]) => {
          const key = groupTurnKey(g);
          return !key || !boundTurns.has(key);
        });
        const showStartIndicator = isRunning && pending.length === 0;
        const StartIndicator = slots.runStartIndicator;

        return (
          <TurnBindingProvider value={{ rootsByMessageId, turnGroupsByMessageId }}>
            {messageElements}
            {pending.length > 0 && (
              <div className="kaboo-inline-cards">
                {pending.map(([groupId, group]) => (
                  <AgentCard key={groupId} groupId={groupId} group={group} showChildren />
                ))}
              </div>
            )}
            {interruptElement}
            {showStartIndicator &&
              (StartIndicator ? <StartIndicator /> : <CopilotChatMessageView.Cursor />)}
          </TurnBindingProvider>
        );
      }}
    </CopilotChatMessageView>
  );
}

/**
 * Drop-in replacement for `CopilotChat`'s `messageView` that renders swarm/graph
 * member cards **live, inside the chat, from the moment the first agent starts**
 * — not only once the final answer streams.
 *
 * Why this exists: cards attached purely to the assistant message
 * ({@link KabooAssistantMessage}) can't appear until an assistant bubble exists,
 * which for a swarm/graph is when the `chat_output` node streams — i.e. at the
 * very end. During the earlier nodes (planner, researcher, …) there is no
 * assistant message, so the chat would show only a spinner while real work is
 * happening.
 *
 * This view renders the normal message list (with {@link KabooAssistantMessage}
 * for settled turns) and, beneath it, an "in-progress" block for any run whose
 * activity groups have appeared but which has **no assistant bubble yet**. As
 * soon as the run's assistant message mounts, that run becomes "covered" and its
 * cards render inside the message instead — so there's a seamless hand-off with
 * no duplication.
 *
 * App-supplied {@link KabooSlots} (from `KabooProvider` or the `slots` prop)
 * plug in here: `runStartIndicator` replaces the bare cursor shown between
 * send and the first activity, and `turnFooter` / message footers render via
 * {@link KabooAssistantMessage} / {@link KabooUserMessage}.
 *
 * Wire it via the `messageView` slot of `CopilotChat`:
 *
 * @example
 * ```tsx
 * import { CopilotChat } from "@copilotkit/react-core/v2";
 * import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";
 *
 * function Chat() {
 *   return <CopilotChat messageView={KabooMessageView} />;
 * }
 * ```
 */
export const KabooMessageView = Object.assign(KabooMessageViewImpl, {
  /**
   * The streaming cursor slot, re-exported from CopilotKit so `KabooMessageView`
   * is a drop-in `messageView` (the slot expects a component carrying `Cursor`).
   */
  Cursor: CopilotChatMessageView.Cursor,
});
