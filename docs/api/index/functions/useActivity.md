[**kaboo-react**](../../README.md)

***

# Function: useActivity()

> **useActivity**(): [`ActivityState`](../interfaces/ActivityState.md)

Defined in: [hooks/useActivity.ts:20](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/hooks/useActivity.ts#L20)

Reads the current [ActivityState](../interfaces/ActivityState.md) (all activity groups for the thread)
from the nearest [KabooActivityProvider](KabooActivityProvider.md). Re-renders on each new
`ACTIVITY_SNAPSHOT`.

## Returns

[`ActivityState`](../interfaces/ActivityState.md)

## Example

```tsx
import { useActivity } from "kaboo-react";

function GroupCount() {
  const { groups } = useActivity();
  return <span>{Object.keys(groups).length} agents</span>;
}
```
