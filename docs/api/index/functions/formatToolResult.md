[**kaboo-react**](../../README.md)

***

# Function: formatToolResult()

> **formatToolResult**(`raw`): `object`

Defined in: [formatters/output.ts:14](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/output.ts#L14)

Parses a raw tool result into a renderable shape: `rows` (for tabular JSON —
either `{ rows: [...] }` or a top-level array of objects) or `text` (a
`key: value` rendering of an object, or the raw string when it isn't JSON).

## Parameters

### raw

`string`

## Returns

### rows

> **rows**: `Record`\<`string`, `string`\>[] \| `null`

Row-shaped result for a table view, or `null` when not tabular.

### text

> **text**: `string`

Text rendering of the result when it is not tabular.

## Example

```ts
import { formatToolResult } from "kaboo-react";

const { rows } = formatToolResult('{"rows":[{"id":"1"}]}');
// rows?.length === 1
```
