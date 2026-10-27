import { useContext } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState, ToolOutcome } from "../types";

/**
 * Reads the current {@link ActivityState} (all activity groups for the thread)
 * from the nearest {@link KabooActivityProvider}. Re-renders on each new
 * `ACTIVITY_SNAPSHOT`.
 *
 * @example
 * ```tsx
 * import { useActivity } from "@pgege/kaboo-react";
 *
 * function GroupCount() {
 *   const { groups } = useActivity();
 *   return <span>{Object.keys(groups).length} agents</span>;
 * }
 * ```
 */
export function useActivity(): ActivityState {
  return useContext(ActivityContext);
}

/**
 * How a top-level tool call ended, as the workflow service reported it on the
 * call's result; `undefined` while it runs, and for results that carry no
 * status. Sub-agent calls read theirs from {@link useToolCallMeta}.
 *
 * @example
 * ```tsx
 * import { useToolOutcome } from "@pgege/kaboo-react";
 *
 * function Failed({ toolCallId }: { toolCallId: string }) {
 *   const outcome = useToolOutcome(toolCallId);
 *   return outcome?.status === "error" ? <span>{outcome.error}</span> : null;
 * }
 * ```
 */
export function useToolOutcome(toolCallId: string | undefined): ToolOutcome | undefined {
  const { toolOutcomes } = useActivity();
  return toolCallId ? toolOutcomes?.[toolCallId] : undefined;
}
