[**@pgege/kaboo-react**](../../README.md)

***

# Interface: InterruptRendererProps\<R\>

Defined in: [src/types.ts:183](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L183)

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

Defined in: [src/types.ts:194](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L194)

Skip the request: the run resumes without an answer or an approval.

#### Returns

`void`

***

### onResolve

> **onResolve**: (`payload`) => `void`

Defined in: [src/types.ts:192](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L192)

Resume the run with the user's answer/approval payload.

#### Parameters

##### payload

`unknown`

#### Returns

`void`

***

### reason

> **reason**: `R`

Defined in: [src/types.ts:190](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L190)

Why the run paused, and what input it needs.

***

### toolCallId?

> `optional` **toolCallId?**: `string`

Defined in: [src/types.ts:200](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L200)

The interrupt's originating tool-call id, when available. Used to correlate
the answered form with the durable tool-call card that renders the Q&A
inline in the transcript.
