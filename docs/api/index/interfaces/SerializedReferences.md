[**@pgege/kaboo-react**](../../README.md)

***

# Interface: SerializedReferences

Defined in: src/references/serialize.ts:85

The fully serialized outgoing payload derived from a set of pending references.

## Properties

### attachmentParts

> **attachmentParts**: (\{ `text`: `string`; `type`: `"text"`; \} \| \{ `metadata?`: `unknown`; `source`: \{ `mimeType`: `string`; `type`: `"data"`; `value`: `string`; \} \| \{ `mimeType?`: `string`; `type`: `"url"`; `value`: `string`; \}; `type`: `"image"`; \} \| \{ `metadata?`: `unknown`; `source`: \{ `mimeType`: `string`; `type`: `"data"`; `value`: `string`; \} \| \{ `mimeType?`: `string`; `type`: `"url"`; `value`: `string`; \}; `type`: `"audio"`; \} \| \{ `metadata?`: `unknown`; `source`: \{ `mimeType`: `string`; `type`: `"data"`; `value`: `string`; \} \| \{ `mimeType?`: `string`; `type`: `"url"`; `value`: `string`; \}; `type`: `"video"`; \} \| \{ `metadata?`: `unknown`; `source`: \{ `mimeType`: `string`; `type`: `"data"`; `value`: `string`; \} \| \{ `mimeType?`: `string`; `type`: `"url"`; `value`: `string`; \}; `type`: `"document"`; \} \| \{ `data?`: `string`; `filename?`: `string`; `id?`: `string`; `mimeType`: `string`; `type`: `"binary"`; `url?`: `string`; \})[]

Defined in: src/references/serialize.ts:87

`InputContent` parts for attachment-transport references (append after text).

***

### objectReferences

> **objectReferences**: [`SerializedObjectReference`](SerializedObjectReference.md)[]

Defined in: src/references/serialize.ts:89

Object-transport references destined for `state.kaboo_references`.
