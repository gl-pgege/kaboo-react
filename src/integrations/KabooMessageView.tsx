import {
  CopilotChatMessageView,
  CopilotChatAssistantMessage,
  useCopilotKit,
  useCopilotChatConfiguration,
  type CopilotChatMessageViewProps,
} from "@copilotkit/react-core/v2";
import { useActivity } from "../hooks/useActivity";
import { AgentCard } from "../components/AgentCard";
import { chatRootGroups, groupTurnKey, type GroupEntry } from "../utils/groups";
import { TurnBindingProvider } from "../context/TurnBinding";
import { KabooAssistantMessage } from "./KabooAssistantMessage";

function KabooMessageViewImpl(props: CopilotChatMessageViewProps) {
  const { groups } = useActivity();
  const { copilotkit } = useCopilotKit();
  const config = useCopilotChatConfiguration();
  const agentId = config?.agentId;
  const threadId = config?.threadId;

  return (
    <CopilotChatMessageView
      {...props}
      assistantMessage={
        KabooAssistantMessage as unknown as typeof CopilotChatAssistantMessage
      }
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
        const list = messages as Array<{ id?: string; role?: string }>;
        for (const m of list) {
          if (m?.role !== "assistant" || !m.id) continue;
          const runId =
            agentId && threadId
              ? copilotkit.getRunIdForMessage(agentId, threadId, m.id)
              : undefined;
          const key = runId ? runToTurn.get(runId) ?? runId : undefined;
          if (!key) continue;
          const turnRoots = rootsByTurn.get(key);
          if (turnRoots) {
            rootsByMessageId.set(m.id, turnRoots);
            boundTurns.add(key);
          }
        }

        const pending = roots.filter(([, g]) => {
          const key = groupTurnKey(g);
          return !key || !boundTurns.has(key);
        });
        const showStartCursor = isRunning && pending.length === 0;

        return (
          <TurnBindingProvider value={{ rootsByMessageId }}>
            {messageElements}
            {pending.length > 0 && (
              <div className="kaboo-inline-cards">
                {pending.map(([groupId, group]) => (
                  <AgentCard key={groupId} groupId={groupId} group={group} showChildren />
                ))}
              </div>
            )}
            {interruptElement}
            {showStartCursor && <CopilotChatMessageView.Cursor />}
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
 * Wire it via the `messageView` slot of `CopilotChat`:
 *
 * @example
 * ```tsx
 * import { CopilotChat } from "@copilotkit/react-core/v2";
 * import { KabooMessageView } from "kaboo-react/copilotkit";
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
