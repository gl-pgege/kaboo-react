[**@pgege/kaboo-react**](../../README.md)

***

# Function: uploadProvider()

> **uploadProvider**(`config?`): [`UploadReferenceProvider`](../interfaces/UploadReferenceProvider.md)

Defined in: [src/references/uploadProvider.tsx:96](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L96)

Built-in file-upload [ReferenceProvider](../interfaces/ReferenceProvider.md). Action-only: choosing it in
the `@` menu opens the file picker; the composer uploads the file (via
`onUpload` or base64) and adds an `attachment`-transport reference.

## Parameters

### config?

[`UploadProviderConfig`](../interfaces/UploadProviderConfig.md) = `{}`

## Returns

[`UploadReferenceProvider`](../interfaces/UploadReferenceProvider.md)

## Example

```tsx
<KabooProvider references={[uploadProvider({ accept: "image/*,.pdf", onUpload })]} ...>
```
