[**@pgege/kaboo-react**](../../README.md)

***

# Function: useTurnFeedback()

> **useTurnFeedback**(`groups`, `onFeedback`): [`TurnFeedbackState`](../interfaces/TurnFeedbackState.md)

Defined in: [src/feedback/useTurnFeedback.ts:98](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L98)

Headless feedback state for one turn: resolves the turn's correlation ids
from its activity groups and tracks the submitted score. Pure mechanism —
the host supplies the storage via `onFeedback`, and can build any UI on top
(or use the bundled [TurnFeedback](TurnFeedback.md) buttons).

## Parameters

### groups

[`GroupEntry`](../type-aliases/GroupEntry.md)[]

### onFeedback

[`FeedbackHandler`](../type-aliases/FeedbackHandler.md)

## Returns

[`TurnFeedbackState`](../interfaces/TurnFeedbackState.md)

## Example

```tsx
import { useTurnFeedback, type GroupEntry } from "@pgege/kaboo-react";

function Score({ groups }: { groups: GroupEntry[] }) {
  const { submit, submitted } = useTurnFeedback(groups, (p) =>
    fetch("/api/feedback", { method: "POST", body: JSON.stringify(p) }),
  );
  return submitted != null ? <span>thanks!</span> : (
    <button onClick={() => submit(1)}>Helpful</button>
  );
}
```
