import { useRenderTool } from "@copilotkit/react-core/v2";
import { useActivity } from "../hooks/useActivity";
import { AgentCard } from "../components/AgentCard";
import { findGroupForCard } from "../utils/groups";
import { KabooToolRender } from "./KabooToolRender";

/**
 * Permissive Standard Schema. `useRenderTool` requires a `parameters` schema for
 * named tools, but the schema is type-only — at render time CopilotKit parses the
 * raw tool arguments directly and never validates against it. This shim satisfies
 * the type without pulling in a schema library (e.g. zod).
 */
const ANY_PARAMETERS = {
  "~standard": {
    version: 1 as const,
    vendor: "kaboo",
    validate: (value: unknown) => ({ value }),
  },
};

/**
 * Renders {@link AgentCard}s inline in the chat for **delegate** sub-agents.
 *
 * Every delegate group is spawned by a delegate tool call and carries its
 * `toolCallId`. We register a v2 tool renderer per such agent so CopilotKit
 * places the card at the tool-call position in the assistant turn, correlated
 * by `(agentName, toolCallId)`.
 *
 * First-class swarm/graph entries have no delegating tool call, so their member
 * cards are rendered by {@link kabooRunCardRenderers} (a CopilotKit
 * `renderCustomMessages` renderer) which anchors them to the assistant turn via
 * its `runId`. Groups carrying a `toolCallId` are excluded there, so the two
 * paths never double-render the same group.
 */
export function KabooInlineCards() {
  const { groups } = useActivity();

  const toolAgentNames = new Set<string>();
  for (const group of Object.values(groups)) {
    if (group.agentName && group.toolCallId) toolAgentNames.add(group.agentName);
  }

  return (
    <>
      {Array.from(toolAgentNames).map((agentName) => (
        <InlineCardAction key={agentName} agentName={agentName} />
      ))}
      <KabooToolRender />
    </>
  );
}

function InlineCardAction({ agentName }: { agentName: string }) {
  useRenderTool({
    name: agentName,
    parameters: ANY_PARAMETERS,
    render: ({ toolCallId, parameters, result, status }) => (
      <InlineCardRenderer
        agentName={agentName}
        toolCallId={toolCallId}
        input={(parameters as { input?: string } | undefined)?.input}
        result={typeof result === "string" ? result : undefined}
        actionStatus={status}
      />
    ),
  });

  return null;
}

function InlineCardRenderer({
  agentName,
  toolCallId,
  input,
  result,
  actionStatus,
}: {
  agentName: string;
  toolCallId: string;
  input?: string;
  result?: string;
  actionStatus?: string;
}) {
  const { groups } = useActivity();
  const entry = findGroupForCard(groups, agentName, toolCallId);

  if (!entry) {
    return <div className="kaboo-agent-card-empty">Loading {agentName}...</div>;
  }

  return (
    <AgentCard
      groupId={entry[0]}
      group={entry[1]}
      input={input}
      result={result}
      actionStatus={actionStatus}
    />
  );
}
