[**@pgege/kaboo-react**](../../README.md)

***

# Function: useInterruptFor()

> **useInterruptFor**(`toolCallId`): [`ActiveInterrupt`](../interfaces/ActiveInterrupt.md) \| `undefined`

Defined in: [src/context/InterruptBridge.tsx:139](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L139)

The first open interrupt anchored to a given tool-call id, or `undefined`.
Lets a tool row claim and render its own gate inline while N concurrent gates
are open, each anchored to a distinct tool call.

## Parameters

### toolCallId

`string` \| `undefined`

## Returns

[`ActiveInterrupt`](../interfaces/ActiveInterrupt.md) \| `undefined`

## Example

```tsx
import { useInterruptFor } from "@pgege/kaboo-react";

function GateBadge({ toolCallId }: { toolCallId: string }) {
  const interrupt = useInterruptFor(toolCallId);
  return interrupt ? <span>Waiting for you</span> : null;
}
```
