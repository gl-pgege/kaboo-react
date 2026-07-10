import { useContext } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState } from "../types";

export function useActivity(): ActivityState {
  return useContext(ActivityContext);
}
