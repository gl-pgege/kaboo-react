import { useContext } from "react";
import { DrillContext } from "../context/DrillContext";
import type { DrillState } from "../types";

/**
 * Reads the drill-down navigation state ({@link DrillState}) from the nearest
 * {@link DrillProvider}: the current path plus `drillIn`/`drillUp`/`drillToRoot`/
 * `drillToLevel`.
 *
 * @example
 * ```tsx
 * import { useDrill } from "@pgege/kaboo-react";
 *
 * function BackButton() {
 *   const { drillUp, activeDrill } = useDrill();
 *   if (!activeDrill) return null;
 *   return <button onClick={drillUp}>Back</button>;
 * }
 * ```
 */
export function useDrill(): DrillState {
  return useContext(DrillContext);
}
