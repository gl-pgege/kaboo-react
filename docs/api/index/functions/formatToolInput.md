[**@pgege/kaboo-react**](../../README.md)

***

# Function: formatToolInput()

> **formatToolInput**(`input`): `object`

Defined in: [src/formatters/input.ts:18](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/input.ts#L18)

Condenses arbitrary tool input into a short one-line `summary` for a tool row.
Prefers well-known fields (`query`/`sql`/`table_name`/`url`), unwraps
single-key objects, and otherwise joins `key: value` pairs. Values read as
text, never JSON. `detail` is reserved for future expansion and is currently
always `null`.

## Parameters

### input

`unknown`

## Returns

### detail

> **detail**: `string` \| `null`

Reserved for future detail expansion; currently always `null`.

### summary

> **summary**: `string`

One-line summary suitable for a tool row.

## Example

```ts
import { formatToolInput } from "@pgege/kaboo-react";

const { summary } = formatToolInput({ query: "select 1" });
// summary === "select 1"
```
