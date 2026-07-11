[**@pgege/kaboo-react**](../../README.md)

***

# Function: MiniTable()

> **MiniTable**(`__namedParameters`): `Element` \| `null`

Defined in: [components/MiniTable.tsx:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/MiniTable.tsx#L15)

Compact table for row-shaped tool results. Columns are inferred from the first
row's keys; underscores in headers become spaces. Renders at most `maxRows`
rows with a "+N more" footer, and nothing at all for an empty list.

## Parameters

### \_\_namedParameters

#### maxRows?

`number` = `8`

#### rows

`Record`\<`string`, `string`\>[]

## Returns

`Element` \| `null`

## Example

```tsx
import { MiniTable } from "@pgege/kaboo-react";

function Example() {
  return <MiniTable rows={[{ id: "1", name: "Ada" }]} maxRows={5} />;
}
```
