[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ReferencesContextValue

Defined in: src/references/ReferencesProvider.tsx:16

Value exposed by [useReferences](../functions/useReferences.md).

## Properties

### addReference

> **addReference**: (`ref`) => `void`

Defined in: src/references/ReferencesProvider.tsx:22

Stage a reference (deduped by id).

#### Parameters

##### ref

[`PendingReference`](../type-aliases/PendingReference.md)

#### Returns

`void`

***

### clearReferences

> **clearReferences**: () => `void`

Defined in: src/references/ReferencesProvider.tsx:26

Clear all staged references (call after a message is sent).

#### Returns

`void`

***

### messageReferences

> **messageReferences**: `Record`\<`string`, [`PendingReference`](../type-aliases/PendingReference.md)[]\>

Defined in: src/references/ReferencesProvider.tsx:33

Object references sent with each user message, keyed by message id. Object
references ride `state.kaboo_references` rather than the message content, so
they'd otherwise be invisible in the sent bubble — this lets the user
message renderer show them as chips.

***

### pending

> **pending**: [`PendingReference`](../type-aliases/PendingReference.md)[]

Defined in: src/references/ReferencesProvider.tsx:20

References currently staged on the composer.

***

### providers

> **providers**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: src/references/ReferencesProvider.tsx:18

Registered `@` providers (upload built-in + app-defined).

***

### recordMessageReferences

> **recordMessageReferences**: (`messageId`, `refs`) => `void`

Defined in: src/references/ReferencesProvider.tsx:35

Record the object references attached to a sent user message.

#### Parameters

##### messageId

`string`

##### refs

[`PendingReference`](../type-aliases/PendingReference.md)[]

#### Returns

`void`

***

### removeReference

> **removeReference**: (`id`) => `void`

Defined in: src/references/ReferencesProvider.tsx:24

Remove a staged reference by id.

#### Parameters

##### id

`string`

#### Returns

`void`
