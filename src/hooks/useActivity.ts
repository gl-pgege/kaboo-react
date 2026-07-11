import { useContext } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState } from "../types";

/**
 * Reads the current {@link ActivityState} (all activity groups for the thread)
 * from the nearest {@link KabooActivityProvider}. Re-renders on each new
 * `ACTIVITY_SNAPSHOT`.
 *
 * @example
 * ```tsx
 * import { useActivity } from "kaboo-react";
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
