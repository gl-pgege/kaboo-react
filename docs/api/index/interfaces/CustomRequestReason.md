[**@pgege/kaboo-react**](../../README.md)

***

# Interface: CustomRequestReason

Defined in: [src/types.ts:127](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L127)

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

Defined in: [src/types.ts:131](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L131)

What the request is for, shown by the fallback card.

***

### type

> **type**: `string`

Defined in: [src/types.ts:129](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L129)

The kind, matched against `interruptRenderers`.
