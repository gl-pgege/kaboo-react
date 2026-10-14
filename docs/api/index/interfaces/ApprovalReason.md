[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ApprovalReason

Defined in: [src/types.ts:89](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L89)

An approval interrupt: the agent is asking the user to approve or reject a
gated tool call before it runs.

## Properties

### expiresAt?

> `optional` **expiresAt?**: `string`

Defined in: [src/types.ts:103](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L103)

ISO-8601 deadline; after it the request can only be dismissed.

***

### message

> **message**: `string`

Defined in: [src/types.ts:93](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L93)

Human-readable description of what is being approved.

***

### request?

> `optional` **request?**: `string`

Defined in: [src/types.ts:108](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L108)

The tool's own request id, when the tool asked for this approval itself.
The host forwards the decision to that tool's service; a card needn't use it.

***

### scopes?

> `optional` **scopes?**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/types.ts:101](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L101)

The scopes the person may choose; absent means `once` only.

***

### subject?

> `optional` **subject?**: [`ApprovalSubject`](ApprovalSubject.md)

Defined in: [src/types.ts:99](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L99)

What "Allow for this chat" or "Always allow" would cover.

***

### tool\_input?

> `optional` **tool\_input?**: `unknown`

Defined in: [src/types.ts:97](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L97)

The proposed tool input, shown for review.

***

### tool\_name

> **tool\_name**: `string`

Defined in: [src/types.ts:95](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L95)

Name of the gated tool awaiting approval.

***

### type

> **type**: `"approval"`

Defined in: [src/types.ts:91](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L91)

Discriminator marking this as an approval gate.
