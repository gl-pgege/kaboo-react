[**@pgege/kaboo-react**](../../README.md)

***

# Function: formatCost()

> **formatCost**(`cost`): `string`

Defined in: [src/formatters/tokens.ts:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/tokens.ts#L34)

Formats a dollar cost for compact display: `2.14159` -> `"$2.14"`,
`0.163` -> `"$0.16"`, values below half a cent -> `"<$0.01"`.

## Parameters

### cost

`number`

## Returns

`string`

## Example

```ts
import { formatCost } from "@pgege/kaboo-react";

formatCost(0.163068); // "$0.16"
```
