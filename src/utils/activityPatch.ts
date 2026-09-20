import { applyPatch, type Operation } from "fast-json-patch";
import type { ActivityState } from "../types";

/**
 * Apply an `ACTIVITY_DELTA` JSON Patch to the activity tree.
 *
 * Each response opens with a full `ACTIVITY_SNAPSHOT` and then patches it, so
 * the tree crosses the wire once instead of being re-sent on every change.
 *
 * Returns a new tree, leaving *state* untouched, so React sees a changed
 * reference. A patch that cannot be applied leaves the tree as it was: a stale
 * card is recoverable, and the run's closing snapshot settles it.
 */
export function applyActivityPatch(state: ActivityState, patch: unknown): ActivityState {
  if (!Array.isArray(patch) || patch.length === 0) return state;
  try {
    return applyPatch(state, patch as Operation[], true, false).newDocument;
  } catch (error) {
    console.warn("kaboo: could not apply an activity patch", error);
    return state;
  }
}
