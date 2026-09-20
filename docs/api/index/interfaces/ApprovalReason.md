[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ApprovalReason

Defined in: [src/types.ts:67](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L67)

An approval interrupt: the agent is asking the user to approve or reject a
gated tool call before it runs.

## Properties

### message

> **message**: `string`

Defined in: [src/types.ts:71](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L71)

Human-readable description of what is being approved.

***

### tool\_input?

> `optional` **tool\_input?**: `unknown`

Defined in: [src/types.ts:75](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L75)

The proposed tool input, shown for review.

***

### tool\_name

> **tool\_name**: `string`

Defined in: [src/types.ts:73](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L73)

Name of the gated tool awaiting approval.

***

### type

> **type**: `"approval"`

Defined in: [src/types.ts:69](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L69)

Discriminator marking this as an approval gate.
