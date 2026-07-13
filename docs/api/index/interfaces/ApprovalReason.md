[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ApprovalReason

Defined in: [src/types.ts:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L56)

An approval interrupt: the agent is asking the user to approve or reject a
gated tool call before it runs.

## Properties

### message

> **message**: `string`

Defined in: [src/types.ts:60](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L60)

Human-readable description of what is being approved.

***

### tool\_input?

> `optional` **tool\_input?**: `unknown`

Defined in: [src/types.ts:64](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L64)

The proposed tool input, shown for review.

***

### tool\_name

> **tool\_name**: `string`

Defined in: [src/types.ts:62](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L62)

Name of the gated tool awaiting approval.

***

### type

> **type**: `"approval"`

Defined in: [src/types.ts:58](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L58)

Discriminator marking this as an approval gate.
