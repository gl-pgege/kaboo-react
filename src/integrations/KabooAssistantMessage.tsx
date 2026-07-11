import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import { AgentCard } from "../components/AgentCard";
import { useTurnBinding } from "../context/TurnBinding";

/**
 * Drop-in replacement for CopilotKit's assistant-message renderer that prepends
 * a first-class swarm/graph turn's member cards ABOVE the assistant's text —
 * inside the chat transcript, as part of the same turn.
 *
 * Wire it via the `messageView` slot of `CopilotChat`:
 *
 * ```tsx
 * <CopilotChat messageView={{ assistantMessage: KabooAssistantMessage }} />
 * ```
 *
 * This is used instead of `renderCustomMessages` because the `CopilotKit`
 * convenience provider hard-overrides that prop; the `messageView`/
 * `assistantMessage` slot is the supported customization surface and is not
 * clobbered.
 *
 * Which cards to show is decided by the turn binding (provided by
 * {@link KabooMessageView}), which resolves each reply message to its turn's
 * member cards — robust to an interrupt/resume splitting the turn across
 * multiple runIds. Delegate cards keep their tool-call path (they carry a
 * `toolCallId` and are excluded from `chatRootGroups`).
 */
export function KabooAssistantMessage(props: CopilotChatAssistantMessageProps) {
  const { message } = props;
  const { rootsByMessageId } = useTurnBinding();
  const messageId = (message as { id?: string })?.id;
  const mine = messageId ? rootsByMessageId.get(messageId) ?? [] : [];

  return (
    <>
      {mine.length > 0 && (
        <div className="kaboo-inline-cards">
          {mine.map(([groupId, group]) => (
            <AgentCard key={groupId} groupId={groupId} group={group} showChildren />
          ))}
        </div>
      )}
      <CopilotChatAssistantMessage {...props} />
    </>
  );
}
