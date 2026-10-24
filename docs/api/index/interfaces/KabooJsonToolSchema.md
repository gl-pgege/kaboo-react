[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooJsonToolSchema\<T\>

Defined in: [src/requests/schema.ts:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L56)

A [KabooToolSchema](KabooToolSchema.md) that also carries the JSON Schema the agent sees.

## Extends

- [`KabooToolSchema`](KabooToolSchema.md)\<`T`\>

## Type Parameters

### T

`T`

## Properties

### ~standard

> `readonly` **~standard**: [`KabooStandardProps`](KabooStandardProps.md)\<`T`\> & `object`

Defined in: [src/requests/schema.ts:58](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L58)

The Standard Schema fields, with the JSON Schema.

#### Type Declaration

##### jsonSchema

> `readonly` **jsonSchema**: `object`

The JSON Schema of the tool's arguments.

###### jsonSchema.input

> `readonly` **input**: () => `object`

The input's JSON Schema.

###### Returns

`object`

###### jsonSchema.output

> `readonly` **output**: () => `object`

The output's JSON Schema.

###### Returns

`object`

#### Overrides

[`KabooToolSchema`](KabooToolSchema.md).[`~standard`](KabooToolSchema.md#standard)
