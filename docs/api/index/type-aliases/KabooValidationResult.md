[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: KabooValidationResult\<T\>

> **KabooValidationResult**\<`T`\> = \{ `issues?`: `undefined`; `value`: `T`; \} \| \{ `issues`: `ReadonlyArray`\<[`KabooSchemaIssue`](../interfaces/KabooSchemaIssue.md)\>; \}

Defined in: [src/requests/schema.ts:16](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L16)

What a [KabooToolSchema](../interfaces/KabooToolSchema.md) check returns: the value, or its problems.

## Type Parameters

### T

`T`

## Union Members

### Type Literal

\{ `issues?`: `undefined`; `value`: `T`; \}

#### issues?

> `readonly` `optional` **issues?**: `undefined`

Never set on a valid value.

#### value

> `readonly` **value**: `T`

The valid value.

***

### Type Literal

\{ `issues`: `ReadonlyArray`\<[`KabooSchemaIssue`](../interfaces/KabooSchemaIssue.md)\>; \}

#### issues

> `readonly` **issues**: `ReadonlyArray`\<[`KabooSchemaIssue`](../interfaces/KabooSchemaIssue.md)\>

The problems with the value.
