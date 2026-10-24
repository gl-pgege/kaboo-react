[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ApprovalDecisionControls

Defined in: [src/components/ApprovalActions.tsx:11](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L11)

What [useApprovalDecision](../functions/useApprovalDecision.md) offers a card.

## Properties

### approve

> **approve**: (`scope?`, `toolInput?`) => `void`

Defined in: [src/components/ApprovalActions.tsx:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L25)

Approve the call. With `thread` or `always`, `KabooInterruptHandler` also
approves the other waiting requests the decision covers (same tool and
subject).

#### Parameters

##### scope?

[`ApprovalScope`](../type-aliases/ApprovalScope.md)

##### toolInput?

`unknown`

#### Returns

`void`

***

### deny

> **deny**: (`reason?`) => `void`

Defined in: [src/components/ApprovalActions.tsx:27](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L27)

Deny the call, with the person's optional reason for the agent.

#### Parameters

##### reason?

`string`

#### Returns

`void`

***

### dismiss

> **dismiss**: () => `void`

Defined in: [src/components/ApprovalActions.tsx:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L29)

Skip the request without answering.

#### Returns

`void`

***

### expired

> **expired**: `boolean`

Defined in: [src/components/ApprovalActions.tsx:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L15)

Whether the request's deadline has passed; it can then only be dismissed.

***

### expiresInMs

> **expiresInMs**: `number` \| `null`

Defined in: [src/components/ApprovalActions.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L17)

Milliseconds until the deadline, or `null` when the request has none.

***

### responded

> **responded**: `boolean`

Defined in: [src/components/ApprovalActions.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L19)

Whether this card already answered.

***

### scopes

> **scopes**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/components/ApprovalActions.tsx:13](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ApprovalActions.tsx#L13)

The scopes to offer: the agent's and the app's, `once` first.
