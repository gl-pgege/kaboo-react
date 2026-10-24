[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooToolSchema\<T\>

Defined in: [src/requests/schema.ts:50](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L50)

A browser tool's arguments schema: any Standard Schema, such as a zod
schema. CopilotKit turns it into the JSON Schema the agent sees, and
kaboo-react checks every call against it before showing it.

## Extended by

- [`KabooJsonToolSchema`](KabooJsonToolSchema.md)

## Type Parameters

### T

`T`

## Properties

### ~standard

> `readonly` **~standard**: [`KabooStandardProps`](KabooStandardProps.md)\<`T`\>

Defined in: [src/requests/schema.ts:52](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L52)

The Standard Schema fields.
