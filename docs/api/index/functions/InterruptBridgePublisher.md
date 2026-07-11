[**kaboo-react**](../../README.md)

***

# Function: InterruptBridgePublisher()

> **InterruptBridgePublisher**(`__namedParameters`): `null`

Defined in: [context/InterruptBridge.tsx:121](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L121)

Publishes the current set of open interrupts to the bridge so each owning
agent card can render its prompt inline at the matching tool-call position.
CopilotKit surfaces every open interrupt at once, so this takes the full list
and keeps the latest resolve/cancel callbacks in a ref — their per-render
identity churn must not re-publish (only the interrupt set should).

## Parameters

### \_\_namedParameters

#### interrupts

[`ActiveInterrupt`](../interfaces/ActiveInterrupt.md)[]

## Returns

`null`
