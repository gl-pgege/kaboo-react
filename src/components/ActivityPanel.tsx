import { useActivity } from "../hooks/useActivity";
import { useDrill } from "../hooks/useDrill";
import { topLevelGroups, directChildren } from "../utils/groups";
import { AgentCard } from "./AgentCard";

export function ActivityPanel() {
  const { groups } = useActivity();
  const { activeDrill } = useDrill();

  if (Object.keys(groups).length === 0) return null;

  // A plain-agent entry group (`inlineChatOwner`) is rendered inline by the host
  // chat, so it must not also appear as a root card here — it only enriches
  // those inline tool rows. Nested/sub-agent drilling is unaffected.
  const filtered = activeDrill
    ? directChildren(groups, activeDrill)
    : topLevelGroups(groups).filter(([, g]) => !g.inlineChatOwner);

  if (filtered.length === 0 && activeDrill) {
    const exact = groups[activeDrill];
    if (exact) {
      return (
        <div className="kaboo-activity-panel">
          <AgentCard groupId={activeDrill} group={exact} />
        </div>
      );
    }
  }

  return (
    <div className="kaboo-activity-panel">
      {filtered.map(([id, group]) => (
        <AgentCard key={id} groupId={id} group={group} />
      ))}
    </div>
  );
}
