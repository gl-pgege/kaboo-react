import { useState, useCallback, createContext, type ReactNode } from "react";
import type { DrillState } from "../types";

const NOOP = () => {};

export const DrillContext = createContext<DrillState>({
  drillPath: [],
  activeDrill: null,
  drillIn: NOOP,
  drillUp: NOOP,
  drillToRoot: NOOP,
  drillToLevel: NOOP,
});

/**
 * Provides drill-down navigation state ({@link DrillState}) to the activity
 * components below it. Included automatically by {@link KabooProvider}; only
 * mount it yourself if you compose the providers by hand.
 *
 * @example
 * ```tsx
 * import { DrillProvider, GlassTabs, DrillDetailView } from "@kaboo/react";
 *
 * function Panel() {
 *   return (
 *     <DrillProvider>
 *       <GlassTabs />
 *       <DrillDetailView />
 *     </DrillProvider>
 *   );
 * }
 * ```
 */
export function DrillProvider({ children }: { children: ReactNode }) {
  const [drillPath, setDrillPath] = useState<string[]>([]);

  const drillIn = useCallback((groupId: string) => {
    setDrillPath((prev) => [...prev, groupId]);
  }, []);

  const drillUp = useCallback(() => {
    setDrillPath((prev) => prev.slice(0, -1));
  }, []);

  const drillToRoot = useCallback(() => {
    setDrillPath([]);
  }, []);

  const drillToLevel = useCallback((level: number) => {
    setDrillPath((prev) => prev.slice(0, level + 1));
  }, []);

  const activeDrill = drillPath.length > 0 ? drillPath[drillPath.length - 1] : null;

  return (
    <DrillContext.Provider value={{ drillPath, activeDrill, drillIn, drillUp, drillToRoot, drillToLevel }}>
      {children}
    </DrillContext.Provider>
  );
}
