[**@pgege/kaboo-react**](../../README.md)

***

# Function: toolSchema()

> **toolSchema**\<`T`\>(`jsonSchema`, `check`): [`KabooJsonToolSchema`](../interfaces/KabooJsonToolSchema.md)\<`T`\>

Defined in: [src/requests/schema.ts:86](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/schema.ts#L86)

Build a [KabooToolSchema](../interfaces/KabooToolSchema.md) from a JSON Schema and a check, for apps
that describe a tool without a schema library.

## Type Parameters

### T

`T`

## Parameters

### jsonSchema

`Record`\<`string`, `unknown`\>

What the agent sees.

### check

(`value`) => `string`[]

The problems with a value, as messages; none when it is valid.

## Returns

[`KabooJsonToolSchema`](../interfaces/KabooJsonToolSchema.md)\<`T`\>

## Example

```ts
import { toolSchema } from "@pgege/kaboo-react";

const pickColor = toolSchema<{ color: string }>(
  { type: "object", properties: { color: { type: "string" } }, required: ["color"] },
  (value) => (typeof (value as { color?: unknown })?.color === "string" ? [] : ["color must be a string"]),
);
```
