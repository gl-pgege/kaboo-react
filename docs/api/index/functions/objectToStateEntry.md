[**@pgege/kaboo-react**](../../README.md)

***

# Function: objectToStateEntry()

> **objectToStateEntry**(`ref`): [`SerializedObjectReference`](../interfaces/SerializedObjectReference.md)

Defined in: src/references/serialize.ts:78

Project an `object`-transport reference to its wire shape.

## Parameters

### ref

#### id

`string`

Stable reference id, shared with the backend manifest.

#### kind

`string`

Reference kind (e.g. `"table"`), resolved by your MCP tool.

#### meta?

`Record`\<`string`, `unknown`\>

Arbitrary extra context threaded through to the resolver.

#### name

`string`

Label shown on the chip.

#### transport

`"object"`

Pointer-only transport discriminant.

## Returns

[`SerializedObjectReference`](../interfaces/SerializedObjectReference.md)
