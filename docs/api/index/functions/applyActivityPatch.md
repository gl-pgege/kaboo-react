[**@pgege/kaboo-react**](../../README.md)

***

# Function: applyActivityPatch()

> **applyActivityPatch**(`state`, `patch`): [`ActivityState`](../interfaces/ActivityState.md)

Defined in: src/utils/activityPatch.ts:14

Apply an `ACTIVITY_DELTA` JSON Patch to the activity tree.

Each response opens with a full `ACTIVITY_SNAPSHOT` and then patches it, so
the tree crosses the wire once instead of being re-sent on every change.

Returns a new tree, leaving *state* untouched, so React sees a changed
reference. A patch that cannot be applied leaves the tree as it was: a stale
card is recoverable, and the run's closing snapshot settles it.

## Parameters

### state

[`ActivityState`](../interfaces/ActivityState.md)

### patch

`unknown`

## Returns

[`ActivityState`](../interfaces/ActivityState.md)
