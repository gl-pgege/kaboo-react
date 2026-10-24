[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooStandardProps\<T\>

Defined in: [src/requests/schema.ts:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L29)

The fields a Standard Schema carries under `~standard`.

## Type Parameters

### T

`T`

## Properties

### types?

> `readonly` `optional` **types?**: `object`

Defined in: [src/requests/schema.ts:37](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L37)

The input and output types, for inference.

#### input

> `readonly` **input**: `unknown`

The input type.

#### output

> `readonly` **output**: `T`

The output type.

***

### validate

> `readonly` **validate**: (`value`) => [`KabooValidationResult`](../type-aliases/KabooValidationResult.md)\<`T`\> \| `Promise`\<[`KabooValidationResult`](../type-aliases/KabooValidationResult.md)\<`T`\>\>

Defined in: [src/requests/schema.ts:35](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L35)

Check a value. kaboo-react supports synchronous checks only.

#### Parameters

##### value

`unknown`

#### Returns

[`KabooValidationResult`](../type-aliases/KabooValidationResult.md)\<`T`\> \| `Promise`\<[`KabooValidationResult`](../type-aliases/KabooValidationResult.md)\<`T`\>\>

***

### vendor

> `readonly` **vendor**: `string`

Defined in: [src/requests/schema.ts:33](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L33)

The library that made the schema.

***

### version

> `readonly` **version**: `1`

Defined in: [src/requests/schema.ts:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L31)

The Standard Schema version.
