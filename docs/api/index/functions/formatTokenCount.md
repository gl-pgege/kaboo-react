[**@pgege/kaboo-react**](../../README.md)

***

# Function: formatTokenCount()

> **formatTokenCount**(`count`): `string`

Defined in: src/formatters/tokens.ts:13

Formats a token count for compact display: `950` -> `"950"`,
`12_400` -> `"12.4k"`, `1_230_000` -> `"1.2M"`. Trailing `.0` is dropped
(`2_000` -> `"2k"`).

## Parameters

### count

`number`

## Returns

`string`

## Example

```ts
import { formatTokenCount } from "@pgege/kaboo-react";

formatTokenCount(48231); // "48.2k"
```
