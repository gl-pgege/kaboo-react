[**@pgege/kaboo-react**](../../README.md)

***

# Function: checkArguments()

> **checkArguments**\<`T`\>(`schema`, `value`): \{ `value`: `T`; \} \| \{ `error`: `string`; \} \| `undefined`

Defined in: [src/requests/schema.ts:119](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L119)

Check a tool call's arguments against its schema.

## Type Parameters

### T

`T`

## Parameters

### schema

[`KabooToolSchema`](../interfaces/KabooToolSchema.md)\<`T`\>

### value

`unknown`

## Returns

The arguments when valid, or the problems as one message the model
can act on. `undefined` while an asynchronous check is pending, which
kaboo-react does not support: keep browser tool schemas synchronous.

### Type Literal

\{ `value`: `T`; \}

#### value

> **value**: `T`

The valid arguments.

***

### Type Literal

\{ `error`: `string`; \}

#### error

> **error**: `string`

The problems, as one message the model can act on.

***

`undefined`
