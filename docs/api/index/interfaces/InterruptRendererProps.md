[**@pgege/kaboo-react**](../../README.md)

***

# Interface: InterruptRendererProps\<R\>

Defined in: [src/types.ts:168](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L168)

Props for a custom interrupt renderer supplied via `interruptRenderers`.
Receives the reason plus resolve/cancel callbacks so a bespoke UI can drive
the gate. A renderer for an app's own request kind types its reason with the
parameter, e.g. `InterruptRendererProps<FilesRequest>`.

## Type Parameters

### R

`R` *extends* `object` = [`InterruptReason`](../type-aliases/InterruptReason.md)

## Properties

### onCancel

> **onCancel**: () => `void`

Defined in: [src/types.ts:179](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L179)

Skip the request: the run resumes without an answer or an approval.

#### Returns

`void`

***

### onResolve

> **onResolve**: (`payload`) => `void`

Defined in: [src/types.ts:177](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L177)

Resume the run with the user's answer/approval payload.

#### Parameters

##### payload

`unknown`

#### Returns

`void`

***

### reason

> **reason**: `R`

Defined in: [src/types.ts:175](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L175)

Why the run paused, and what input it needs.

***

### toolCallId?

> `optional` **toolCallId?**: `string`

Defined in: [src/types.ts:185](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L185)

The interrupt's originating tool-call id, when available. Used to correlate
the answered form with the durable tool-call card that renders the Q&A
inline in the transcript.
