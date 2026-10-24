import { useMemo } from "react";
import { useAgent, UseAgentUpdate } from "@copilotkit/react-core/v2";
import { useActivity } from "./useActivity";

/**
 * The agent's shared state, or the part a selector picks — such as the
 * `kaboo_workspace` the engine writes as tools succeed. Re-renders when the
 * state changes.
 *
 * @param select - Picks the part the component needs; the whole state when omitted.
 * @param agentId - The agent; the provider's when omitted.
 *
 * @example
 * ```tsx
 * import { useAgentState } from "@pgege/kaboo-react";
 *
 * function Focus() {
 *   const focus = useAgentState((state) => (state.kaboo_workspace as { focus?: { id: string } } | undefined)?.focus);
 *   return focus ? <span>Kaboo is on {focus.id}</span> : null;
 * }
 * ```
 */
export function useAgentState<T = Record<string, unknown>>(
  select?: (state: Record<string, unknown>) => T,
  agentId?: string,
): T {
  const { agent } = useAgent({ ...(agentId ? { agentId } : {}), updates: [UseAgentUpdate.OnStateChanged] });
  const state = (agent.state ?? {}) as Record<string, unknown>;
  return select ? select(state) : (state as T);
}

/** A tool call still running, with its arguments as far as they have streamed. */
export interface LiveToolCall {
  /** The call's id. */
  toolCallId: string;
  /** The tool's name. */
  toolName: string;
  /** The arguments parsed so far; partial while the model is still writing them. */
  args: unknown;
  /** The sub-agent making the call. */
  subagentRunId: string;
  /** The name of the agent making the call. */
  agentName: string;
}

/**
 * Every sub-agent tool call still running, with its arguments as they stream,
 * so a canvas can show what is about to change — a widget taking shape while
 * the agent writes it.
 *
 * @param toolName - Only calls to this tool, or to tools matching it.
 *
 * @example
 * ```tsx
 * import { useLiveToolCalls } from "@pgege/kaboo-react";
 *
 * function GhostWidgets() {
 *   const plotting = useLiveToolCalls(/plot_widgets$/);
 *   return <>{plotting.map((call) => <Ghost key={call.toolCallId} args={call.args} />)}</>;
 * }
 * ```
 */
export function useLiveToolCalls(toolName?: string | RegExp): LiveToolCall[] {
  const { groups } = useActivity();
  return useMemo(
    () =>
      Object.entries(groups).flatMap(([subagentRunId, group]) =>
        group.tools
          .filter((tool) => tool.status === "running" && tool.toolResult === undefined)
          .filter((tool) =>
            toolName === undefined
              ? true
              : typeof toolName === "string"
                ? tool.toolName === toolName
                : toolName.test(tool.toolName),
          )
          .map((tool) => ({
            toolCallId: tool.toolUseId,
            toolName: tool.toolName,
            args: tool.toolInput,
            subagentRunId,
            agentName: group.agentName,
          })),
      ),
    [groups, toolName],
  );
}

/** A sub-agent at work. */
export interface AgentPresence {
  /** The sub-agent invocation. */
  subagentRunId: string;
  /** The agent's name. */
  agentName: string;
  /** The title the workflow gives its card. */
  title: string;
  /** The tool it is running, if any. */
  tool?: string;
}

/**
 * The sub-agents working right now, and what each is running, so a canvas can
 * show who is touching what.
 *
 * @example
 * ```tsx
 * import { useAgentPresence } from "@pgege/kaboo-react";
 *
 * function Presence() {
 *   const working = useAgentPresence();
 *   return <>{working.map((agent) => <span key={agent.subagentRunId}>{agent.title}</span>)}</>;
 * }
 * ```
 */
export function useAgentPresence(): AgentPresence[] {
  const { groups } = useActivity();
  return useMemo(
    () =>
      Object.entries(groups)
        .filter(([, group]) => group.status === "active")
        .map(([subagentRunId, group]) => {
          const running = group.tools.find((tool) => tool.status === "running" && tool.toolResult === undefined);
          return {
            subagentRunId,
            agentName: group.agentName,
            title: group.title,
            ...(running ? { tool: running.toolName } : {}),
          };
        }),
    [groups],
  );
}
