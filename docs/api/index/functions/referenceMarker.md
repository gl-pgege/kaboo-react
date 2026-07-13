[**@pgege/kaboo-react**](../../README.md)

***

# Function: referenceMarker()

> **referenceMarker**(`ref`): `string`

Defined in: [src/references/serialize.ts:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L29)

The textual marker kept at a reference's mention position in the message
text, so the model sees *where* each reference was cited (correlated to the
manifest by id). Chip UIs render `@name`; the serialized text keeps this
token.

## Parameters

### ref

[`PendingReference`](../type-aliases/PendingReference.md)

## Returns

`string`
