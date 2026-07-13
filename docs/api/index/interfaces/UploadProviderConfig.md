[**@pgege/kaboo-react**](../../README.md)

***

# Interface: UploadProviderConfig

Defined in: [src/references/uploadProvider.tsx:7](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L7)

Configuration for the built-in file [uploadProvider](../functions/uploadProvider.md).

## Properties

### accept?

> `optional` **accept?**: `string`

Defined in: [src/references/uploadProvider.tsx:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L15)

`accept` filter for the file picker (e.g. `"image/*,.pdf"`).

***

### id?

> `optional` **id?**: `string`

Defined in: [src/references/uploadProvider.tsx:9](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L9)

Provider id in the `@` menu. Default `"upload"`.

***

### kind?

> `optional` **kind?**: `string`

Defined in: [src/references/uploadProvider.tsx:13](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L13)

Reference kind stamped on emitted attachments. Default `"file"`.

***

### label?

> `optional` **label?**: `string`

Defined in: [src/references/uploadProvider.tsx:11](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L11)

Group label in the `@` menu. Default `"Upload"`.

***

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: [src/references/uploadProvider.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L17)

Max file size in bytes. Files above this are rejected. Default 20MB.

***

### onUpload?

> `optional` **onUpload?**: (`file`) => `AttachmentUploadResult` \| `Promise`\<`AttachmentUploadResult`\>

Defined in: [src/references/uploadProvider.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L24)

Store the file and return a fetchable source. Return a `url` (presigned or
public — the server fetches it with no auth) or inline `data` (base64).
When omitted, the file is inlined as base64 (fine for small files/tests,
bloats the event log for large ones).

#### Parameters

##### file

`File`

#### Returns

`AttachmentUploadResult` \| `Promise`\<`AttachmentUploadResult`\>
