[**@pgege/kaboo-react**](../../README.md)

***

# Function: buildAttachmentsConfig()

> **buildAttachmentsConfig**(`config?`): `AttachmentsConfig`

Defined in: src/references/uploadProvider.tsx:122

Build a CopilotKit `AttachmentsConfig` from an upload config, wrapping
`onUpload` so every uploaded file carries kaboo id/kind/name in its
`InputContent` metadata. Pass to `<CopilotChat attachments={...}>` to use
CopilotKit's native attachment UI instead of the `@` composer.

## Parameters

### config?

[`UploadProviderConfig`](../interfaces/UploadProviderConfig.md) = `{}`

## Returns

`AttachmentsConfig`
