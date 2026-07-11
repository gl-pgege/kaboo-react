[**kaboo-react**](../../README.md)

***

# Function: formatToolInput()

> **formatToolInput**(`input`): `object`

Defined in: [formatters/input.ts:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/input.ts#L15)

Condenses arbitrary tool input into a short one-line `summary` for a tool row.
Prefers well-known fields (`query`/`table_name`/`url`), unwraps single-key
objects, and otherwise joins `key: value` pairs. `detail` is reserved for
future expansion and is currently always `null`.

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
import { formatToolInput } from "kaboo-react";

const { summary } = formatToolInput({ query: "select 1" });
// summary === "select 1"
```
