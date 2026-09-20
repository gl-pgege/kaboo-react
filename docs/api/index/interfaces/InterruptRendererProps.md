[**@pgege/kaboo-react**](../../README.md)

***

# Interface: InterruptRendererProps

Defined in: [src/types.ts:113](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L113)

Props for a custom interrupt renderer supplied via `interruptRenderers`.
Receives the reason plus resolve/cancel callbacks so a bespoke UI can drive
the gate.

## Properties

### onCancel

> **onCancel**: () => `void`

Defined in: [src/types.ts:119](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L119)

Cancel/reject the gate, resuming the run without a positive answer.

#### Returns

`void`

***

### onResolve

> **onResolve**: (`payload`) => `void`

Defined in: [src/types.ts:117](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L117)

Resume the run with the user's answer/approval payload.

#### Parameters

##### payload

`unknown`

#### Returns

`void`

***

### reason

> **reason**: [`InterruptReason`](../type-aliases/InterruptReason.md)

Defined in: [src/types.ts:115](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L115)

Why the run paused, and what input it needs.

***

### toolCallId?

> `optional` **toolCallId?**: `string`

Defined in: [src/types.ts:125](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L125)

The interrupt's originating tool-call id, when available. Used to correlate
the answered form with the durable tool-call card that renders the Q&A
inline in the transcript.
