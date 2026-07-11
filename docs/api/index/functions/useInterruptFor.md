[**kaboo-react**](../../README.md)

***

# Function: useInterruptFor()

> **useInterruptFor**(`toolCallId`): [`ActiveInterrupt`](../interfaces/ActiveInterrupt.md) \| `undefined`

Defined in: [context/InterruptBridge.tsx:106](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/InterruptBridge.tsx#L106)

The first open interrupt anchored to a given tool-call id, or `undefined`.
Lets a tool row claim and render its own gate inline while N concurrent gates
are open, each anchored to a distinct tool call.

## Parameters

### toolCallId

`string` \| `undefined`

## Returns

[`ActiveInterrupt`](../interfaces/ActiveInterrupt.md) \| `undefined`
