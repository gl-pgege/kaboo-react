[**@pgege/kaboo-react**](../../README.md)

***

# Function: buildUserContent()

> **buildUserContent**(`text`, `attachmentParts`): `ContentPart`[]

Defined in: [src/references/serialize.ts:129](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L129)

Build the multimodal `content` array for a user message: the typed text
(already containing positional markers) followed by the attachment parts.
AG-UI content is an ordered array, so parts are appended after the text.

## Parameters

### text

`string`

### attachmentParts

`ContentPart`[]

## Returns

`ContentPart`[]
