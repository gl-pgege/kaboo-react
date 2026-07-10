import { useDefaultRenderTool } from "@copilotkit/react-core/v2";
import { useActivity } from "../hooks/useActivity";
import { ToolRow } from "../components/ToolRow";
import { isControlOnlyStatus } from "../formatters/output";
import type { StreamGroup, ToolCall } from "../types";

function findTool(
  groups: Record<string, StreamGroup>,
  toolCallId: string,
): ToolCall | undefined {
  for (const group of Object.values(groups)) {
    const match = group.tools.find((t) => t.toolUseId === toolCallId);
    if (match) return match;
  }
  return undefined;
}

/** A tool call whose name/id spawned a delegate sub-agent group is owned by
 * {@link KabooInlineCards} (renders an AgentCard). Detect it so the wildcard
 * doesn't briefly render it as a plain tool row before that card registers. */
function isDelegateSpawn(
  groups: Record<string, StreamGroup>,
  name: string,
  toolCallId: string,
): boolean {
  for (const group of Object.values(groups)) {
    if (!group.toolCallId) continue;
    if (group.toolCallId === toolCallId || group.agentName === name) return true;
  }
  return false;
}

/**
 * Wildcard (`"*"`) tool-call renderer: persists any plain tool call inline in
 * the chat transcript. Tools with a dedicated renderer (`ask_user`, delegate
 * sub-agents) take precedence and never reach this fallback — and delegate
 * spawns are skipped explicitly to avoid a flash before their AgentCard
 * registers.
 *
 * The rich record (label, formatted result, error status) is sourced from the
 * activity store by tool-call id; a minimal record built from the raw render
 * props is used while the group is still catching up, so the card never
 * disappears once the tool resolves.
 */
export function KabooToolRender() {
  const { groups } = useActivity();

  useDefaultRenderTool(
    {
      render: ({ name, toolCallId, parameters, status, result }) => {
        if (isDelegateSpawn(groups, name, toolCallId)) return <></>;
        const fromActivity = findTool(groups, toolCallId);
        // A bare HITL control echo (e.g. {"status":"approved"} or
        // {"status":"cancelled"}) is the interrupt-resolution payload, not real
        // tool output. Keep the tool row (a real gated call must never vanish),
        // but drop the echo as the result so we don't dump raw JSON — the real
        // output arrives via the activity store once the resumed tool finishes.
        const controlEcho = !fromActivity && isControlOnlyStatus(result);
        const tool: ToolCall =
          fromActivity ?? {
            toolUseId: toolCallId,
            toolName: name,
            toolInput: parameters,
            toolResult:
              controlEcho || typeof result !== "string" ? undefined : result,
            status: status === "complete" ? "success" : "running",
          };
        return (
          <div className="kaboo-inline-tool">
            <ToolRow tool={tool} />
          </div>
        );
      },
    },
    [groups],
  );

  return null;
}
