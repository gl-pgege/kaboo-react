[**@pgege/kaboo-react**](../../README.md)

***

# Interface: SerializedReferences

Defined in: [src/references/serialize.ts:85](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L85)

The fully serialized outgoing payload derived from a set of pending references.

## Properties

### attachmentParts

> **attachmentParts**: `ContentPart`[]

Defined in: [src/references/serialize.ts:87](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L87)

`InputContent` parts for attachment-transport references (append after text).

***

### objectReferences

> **objectReferences**: [`SerializedObjectReference`](SerializedObjectReference.md)[]

Defined in: [src/references/serialize.ts:89](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L89)

Object-transport references destined for `state.kaboo_references`.
