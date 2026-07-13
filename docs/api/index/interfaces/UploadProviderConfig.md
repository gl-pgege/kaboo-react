[**@pgege/kaboo-react**](../../README.md)

***

# Interface: UploadProviderConfig

Defined in: src/references/uploadProvider.tsx:7

Configuration for the built-in file [uploadProvider](../functions/uploadProvider.md).

## Properties

### accept?

> `optional` **accept?**: `string`

Defined in: src/references/uploadProvider.tsx:15

`accept` filter for the file picker (e.g. `"image/*,.pdf"`).

***

### id?

> `optional` **id?**: `string`

Defined in: src/references/uploadProvider.tsx:9

Provider id in the `@` menu. Default `"upload"`.

***

### kind?

> `optional` **kind?**: `string`

Defined in: src/references/uploadProvider.tsx:13

Reference kind stamped on emitted attachments. Default `"file"`.

***

### label?

> `optional` **label?**: `string`

Defined in: src/references/uploadProvider.tsx:11

Group label in the `@` menu. Default `"Upload"`.

***

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: src/references/uploadProvider.tsx:17

Max file size in bytes. Files above this are rejected. Default 20MB.

***

### onUpload?

> `optional` **onUpload?**: (`file`) => `AttachmentUploadResult` \| `Promise`\<`AttachmentUploadResult`\>

Defined in: src/references/uploadProvider.tsx:24

Store the file and return a fetchable source. Return a `url` (presigned or
public — the server fetches it with no auth) or inline `data` (base64).
When omitted, the file is inlined as base64 (fine for small files/tests,
bloats the event log for large ones).

#### Parameters

##### file

`File`

#### Returns

`AttachmentUploadResult` \| `Promise`\<`AttachmentUploadResult`\>
