[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ApprovalDecisionControls

Defined in: src/components/ApprovalActions.tsx:12

What [useApprovalDecision](../functions/useApprovalDecision.md) offers a card.

## Properties

### approve

> **approve**: (`scope?`, `toolInput?`) => `void`

Defined in: src/components/ApprovalActions.tsx:25

Approve the call. `thread` or `always` also approves the other waiting
requests the decision covers (same tool and subject).

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

Defined in: src/components/ApprovalActions.tsx:27

Deny the call, with the person's optional reason for the agent.

#### Parameters

##### reason?

`string`

#### Returns

`void`

***

### dismiss

> **dismiss**: () => `void`

Defined in: src/components/ApprovalActions.tsx:29

Skip the request without answering.

#### Returns

`void`

***

### expired

> **expired**: `boolean`

Defined in: src/components/ApprovalActions.tsx:16

Whether the request's deadline has passed; it can then only be dismissed.

***

### expiresInMs

> **expiresInMs**: `number` \| `null`

Defined in: src/components/ApprovalActions.tsx:18

Milliseconds until the deadline, or `null` when the request has none.

***

### responded

> **responded**: `boolean`

Defined in: src/components/ApprovalActions.tsx:20

Whether this card already answered.

***

### scopes

> **scopes**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: src/components/ApprovalActions.tsx:14

The scopes to offer: the agent's and the app's, `once` first.
