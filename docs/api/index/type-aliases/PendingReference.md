[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: PendingReference

> **PendingReference** = \{ `id`: `string`; `kind`: `string`; `mimeType`: `string`; `name`: `string`; `source`: \{ `url`: `string`; \} \| \{ `data`: `string`; \}; `transport`: `"attachment"`; \} \| \{ `id`: `string`; `kind`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `name`: `string`; `transport`: `"object"`; \}

Defined in: src/references/types.ts:52

A reference that has been selected and is pending on the composer, before it
is serialized onto the outgoing message.

## Union Members

### Type Literal

\{ `id`: `string`; `kind`: `string`; `mimeType`: `string`; `name`: `string`; `source`: \{ `url`: `string`; \} \| \{ `data`: `string`; \}; `transport`: `"attachment"`; \}

#### id

> **id**: `string`

Stable reference id, shared with the backend manifest.

#### kind

> **kind**: `string`

Reference kind (e.g. `"file"`).

#### mimeType

> **mimeType**: `string`

MIME type of the file.

#### name

> **name**: `string`

File name shown on the chip.

#### source

> **source**: \{ `url`: `string`; \} \| \{ `data`: `string`; \}

Byte source: a fetchable URL, or inline base64.

##### Union Members

###### Type Literal

\{ `url`: `string`; \}

###### url

> **url**: `string`

A fetchable URL (preferred; keeps transport and log small).

***

###### Type Literal

\{ `data`: `string`; \}

###### data

> **data**: `string`

Inline base64 payload (fallback for small files).

#### transport

> **transport**: `"attachment"`

Blob-capable transport discriminant.

***

### Type Literal

\{ `id`: `string`; `kind`: `string`; `meta?`: `Record`\<`string`, `unknown`\>; `name`: `string`; `transport`: `"object"`; \}

#### id

> **id**: `string`

Stable reference id, shared with the backend manifest.

#### kind

> **kind**: `string`

Reference kind (e.g. `"table"`), resolved by your MCP tool.

#### meta?

> `optional` **meta?**: `Record`\<`string`, `unknown`\>

Arbitrary extra context threaded through to the resolver.

#### name

> **name**: `string`

Label shown on the chip.

#### transport

> **transport**: `"object"`

Pointer-only transport discriminant.
