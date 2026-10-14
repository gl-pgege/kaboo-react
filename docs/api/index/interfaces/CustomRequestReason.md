[**@pgege/kaboo-react**](../../README.md)

***

# Interface: CustomRequestReason

Defined in: [src/types.ts:138](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L138)

An app's own request kind (`files`, `datasources`, …), raised by the app's
tool and rendered by the renderer the app registers for its `type` in
`interruptRenderers`. Kinds without a renderer get a minimal card with the
message and Skip.

## Indexable

> \[`field`: `string`\]: `unknown`

The app's own fields.

## Properties

### message?

> `optional` **message?**: `string`

Defined in: [src/types.ts:142](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L142)

What the request is for, shown by the fallback card.

***

### type

> **type**: `string`

Defined in: [src/types.ts:140](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L140)

The kind, matched against `interruptRenderers`.
