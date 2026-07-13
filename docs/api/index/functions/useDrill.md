[**@pgege/kaboo-react**](../../README.md)

***

# Function: useDrill()

> **useDrill**(): [`DrillState`](../interfaces/DrillState.md)

Defined in: [src/hooks/useDrill.ts:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/useDrill.ts#L21)

Reads the drill-down navigation state ([DrillState](../interfaces/DrillState.md)) from the nearest
[DrillProvider](DrillProvider.md): the current path plus `drillIn`/`drillUp`/`drillToRoot`/
`drillToLevel`.

## Returns

[`DrillState`](../interfaces/DrillState.md)

## Example

```tsx
import { useDrill } from "@pgege/kaboo-react";

function BackButton() {
  const { drillUp, activeDrill } = useDrill();
  if (!activeDrill) return null;
  return <button onClick={drillUp}>Back</button>;
}
```
