[**@pgege/kaboo-react**](../../README.md)

***

# Function: uploadFileToReference()

> **uploadFileToReference**(`file`, `config`): `Promise`\<[`PendingReference`](../type-aliases/PendingReference.md)\>

Defined in: [src/references/uploadProvider.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L56)

Upload one file and return the pending attachment reference (id minted here).
Uses `config.onUpload` when provided, else inlines the bytes as base64.

## Parameters

### file

`File`

### config

[`UploadProviderConfig`](../interfaces/UploadProviderConfig.md)

## Returns

`Promise`\<[`PendingReference`](../type-aliases/PendingReference.md)\>
