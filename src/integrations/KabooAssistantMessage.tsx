import {
  CopilotChatAssistantMessage,
  type CopilotChatAssistantMessageProps,
} from "@copilotkit/react-core/v2";
import { AgentCard } from "../components/AgentCard";
import { useTurnBinding } from "../context/TurnBinding";
import { useKabooSlots, type SlotMessage } from "../context/KabooSlots";
import { resolveTurnIds } from "../feedback/useTurnFeedback";
import { useActivity } from "../hooks/useActivity";

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
 *
 * Below the reply it renders the app's `KabooSlots` when provided: the
 * `turnFooter` (once, anchored on the turn's final assistant message, with all
 * of the turn's groups) and then the `assistantMessageFooter`. Both default to
 * nothing.
 */
export function KabooAssistantMessage(props: CopilotChatAssistantMessageProps) {
  const { message } = props;
  const { rootsByMessageId, turnGroupsByMessageId, turnRunsByMessageId } = useTurnBinding();
  const { turnFooter, assistantMessageFooter } = useKabooSlots();
  const activity = useActivity();
  const messageId = (message as { id?: string })?.id;
  const mine = messageId ? rootsByMessageId.get(messageId) ?? [] : [];
  const turnGroups = messageId ? turnGroupsByMessageId.get(messageId) ?? [] : [];
  const turnRuns = messageId ? turnRunsByMessageId.get(messageId) : undefined;
  const turnTraceId =
    resolveTurnIds(turnGroups, activity.traceByRun).traceId ??
    turnRuns?.map((run) => activity.traceByRun?.[run]).find(Boolean);
  const subagentRunId = (message as { subagentRunId?: string })?.subagentRunId;

  if (subagentRunId) {
    const group = activity.groups[subagentRunId];
    return (
      <div className="kaboo-request-from-agent">
        <div className="kaboo-request-agent">{group?.title ?? group?.agentName ?? "A sub-agent"}</div>
        <CopilotChatAssistantMessage {...props} />
      </div>
    );
  }

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
      {turnFooter && messageId && turnRuns && (
        <div className="kaboo-turn-footer">
          {turnFooter({
            messageId,
            message: message as unknown as SlotMessage,
            groups: turnGroups,
            runIds: turnRuns,
            traceId: turnTraceId,
          })}
        </div>
      )}
      {assistantMessageFooter && (
        <div className="kaboo-message-footer">
          {assistantMessageFooter(message as unknown as SlotMessage)}
        </div>
      )}
    </>
  );
}
