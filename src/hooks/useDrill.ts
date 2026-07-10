import { useContext } from "react";
import { DrillContext } from "../context/DrillContext";
import type { DrillState } from "../types";

export function useDrill(): DrillState {
  return useContext(DrillContext);
}
