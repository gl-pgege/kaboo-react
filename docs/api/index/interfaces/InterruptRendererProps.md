[**@kaboo/react**](../../README.md)

***

# Interface: InterruptRendererProps

Defined in: [types.ts:102](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L102)

Props for a custom interrupt renderer supplied via `interruptRenderers`.
Receives the reason plus resolve/cancel callbacks so a bespoke UI can drive
the gate.

## Properties

### onCancel

> **onCancel**: () => `void`

Defined in: [types.ts:108](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L108)

Cancel/reject the gate, resuming the run without a positive answer.

#### Returns

`void`

***

### onResolve

> **onResolve**: (`payload`) => `void`

Defined in: [types.ts:106](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L106)

Resume the run with the user's answer/approval payload.

#### Parameters

##### payload

`unknown`

#### Returns

`void`

***

### reason

> **reason**: [`InterruptReason`](../type-aliases/InterruptReason.md)

Defined in: [types.ts:104](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L104)

Why the run paused, and what input it needs.

***

### toolCallId?

> `optional` **toolCallId?**: `string`

Defined in: [types.ts:114](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L114)

The interrupt's originating tool-call id, when available. Used to correlate
the answered form with the durable tool-call card that renders the Q&A
inline in the transcript.
