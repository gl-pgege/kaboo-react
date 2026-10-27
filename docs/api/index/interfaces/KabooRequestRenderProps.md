[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooRequestRenderProps\<T\>

Defined in: [src/requests/useRequestTool.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L19)

What a request panel receives.

## Type Parameters

### T

`T`

## Properties

### answer

> **answer**: (`value`) => `void`

Defined in: [src/requests/useRequestTool.tsx:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L29)

Answer the request. Objects are sent as JSON.

#### Parameters

##### value

`unknown`

#### Returns

`void`

***

### args

> **args**: `T`

Defined in: [src/requests/useRequestTool.tsx:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L23)

The call's arguments, checked against the tool's schema.

***

### result?

> `optional` **result?**: `string`

Defined in: [src/requests/useRequestTool.tsx:27](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L27)

The answer sent, once there is one.

***

### skip

> **skip**: () => `void`

Defined in: [src/requests/useRequestTool.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L31)

Decline to answer.

#### Returns

`void`

***

### status

> **status**: [`KabooRequestStatus`](../type-aliases/KabooRequestStatus.md)

Defined in: [src/requests/useRequestTool.tsx:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L25)

`waiting` for the person, `sent` once answered, `complete` once the agent has the answer.

***

### toolCallId

> **toolCallId**: `string`

Defined in: [src/requests/useRequestTool.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L21)

The call's id.
