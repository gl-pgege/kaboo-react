[**kaboo-react**](../../README.md)

***

# Function: useInterruptBridge()

> **useInterruptBridge**(): `object`

Defined in: [context/InterruptBridge.tsx:92](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/InterruptBridge.tsx#L92)

Reads the InterruptBridge: the list of open interrupts plus `publish`. Most
consumers want [useInterruptFor](useInterruptFor.md) instead; use this to inspect or drive
the whole set.

## Returns

### active

> **active**: [`ActiveInterrupt`](../interfaces/ActiveInterrupt.md)[]

Every open interrupt from the current run, in emission order.

### publish

> **publish**: (`interrupts`) => `void`

Replace the set of interrupts published to the bridge.

#### Parameters

##### interrupts

[`ActiveInterrupt`](../interfaces/ActiveInterrupt.md)[]

#### Returns

`void`

## Example

```tsx
import { useInterruptBridge } from "kaboo-react";

function OpenGateCount() {
  const { active } = useInterruptBridge();
  return <span>{active.length} open</span>;
}
```
