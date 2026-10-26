[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ApprovalReason

Defined in: [src/types.ts:78](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L78)

An approval interrupt: the agent is asking the user to approve or reject a
gated tool call before it runs.

## Properties

### expiresAt?

> `optional` **expiresAt?**: `string`

Defined in: [src/types.ts:92](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L92)

ISO-8601 deadline; after it the request can only be dismissed.

***

### message

> **message**: `string`

Defined in: [src/types.ts:82](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L82)

Human-readable description of what is being approved.

***

### request?

> `optional` **request?**: `string`

Defined in: [src/types.ts:97](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L97)

The tool's own request id, when the tool asked for this approval itself.
The host forwards the decision to that tool's service; a card needn't use it.

***

### scopes?

> `optional` **scopes?**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/types.ts:90](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L90)

The scopes the person may choose; absent means `once` only.

***

### subject?

> `optional` **subject?**: [`ApprovalSubject`](ApprovalSubject.md)

Defined in: [src/types.ts:88](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L88)

What "Allow for this chat" or "Always allow" would cover.

***

### tool\_input?

> `optional` **tool\_input?**: `unknown`

Defined in: [src/types.ts:86](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L86)

The proposed tool input, shown for review.

***

### tool\_name

> **tool\_name**: `string`

Defined in: [src/types.ts:84](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L84)

Name of the gated tool awaiting approval.

***

### type

> **type**: `"approval"`

Defined in: [src/types.ts:80](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L80)

Discriminator marking this as an approval gate.
