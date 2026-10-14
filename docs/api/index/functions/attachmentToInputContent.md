[**@pgege/kaboo-react**](../../README.md)

***

# Function: attachmentToInputContent()

> **attachmentToInputContent**(`ref`): `ContentPart`

Defined in: [src/references/serialize.ts:46](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L46)

Turn an `attachment`-transport reference into a CopilotKit `InputContent`
part, stamping the reference id/kind/name into `metadata` so kaboo-workflows
can key its registry off the same id the model reads from the manifest.

## Parameters

### ref

#### id

`string`

Stable reference id, shared with the backend manifest.

#### kind

`string`

Reference kind (e.g. `"file"`).

#### mimeType

`string`

MIME type of the file.

#### name

`string`

File name shown on the chip.

#### source

\{ `url`: `string`; \} \| \{ `data`: `string`; \}

Byte source: a fetchable URL, or inline base64.

#### transport

`"attachment"`

Blob-capable transport discriminant.

## Returns

`ContentPart`
