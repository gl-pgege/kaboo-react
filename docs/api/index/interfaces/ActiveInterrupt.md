[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ActiveInterrupt

Defined in: [src/context/InterruptBridge.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L17)

An open interrupt published onto the InterruptBridge so an owning agent card
can render its prompt inline (rather than only in the chat slot). Carries the
reason plus resolve/cancel callbacks bound to this specific interrupt id.

## Properties

### id

> **id**: `string`

Defined in: [src/context/InterruptBridge.tsx:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L23)

Unique interrupt id (from the AG-UI interrupt). Distinguishes concurrent
gates that may share a single tool-call id (e.g. two parallel sub-agent
gates re-keyed onto one delegating call), so each resolves independently.

***

### onCancel

> **onCancel**: () => `void`

Defined in: [src/context/InterruptBridge.tsx:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L29)

Cancel/reject this gate, resuming the run without a positive answer.

#### Returns

`void`

***

### onResolve

> **onResolve**: (`payload`) => `void`

Defined in: [src/context/InterruptBridge.tsx:27](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L27)

Resume the run with the user's answer/approval payload.

#### Parameters

##### payload

`unknown`

#### Returns

`void`

***

### reason

> **reason**: [`InterruptReason`](../type-aliases/InterruptReason.md)

Defined in: [src/context/InterruptBridge.tsx:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L25)

Why the run paused, and what input it needs.

***

### toolCallId?

> `optional` **toolCallId?**: `string`

Defined in: [src/context/InterruptBridge.tsx:36](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L36)

The originating tool-call id, when the interrupt was raised by a tool (e.g.
`ask_user` or a gated tool). Lets the owning agent card render the live
prompt inline at its tool-call position, so the prompt sits in chronological
order rather than in a separate top-level slot.
