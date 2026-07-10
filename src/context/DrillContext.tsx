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
