[**@pgege/kaboo-react**](../../README.md)

***

# Function: cachedShare()

> **cachedShare**(`usage`): `number` \| `null`

Defined in: src/formatters/tokens.ts:52

Returns the cached share of input tokens as a whole percentage
(`0`–`100`), or `null` when the usage carries no cache accounting or no
input tokens.

## Parameters

### usage

#### cacheReadInputTokens?

`number`

#### inputTokens

`number`

## Returns

`number` \| `null`

## Example

```ts
import { cachedShare } from "@pgege/kaboo-react";

cachedShare({ inputTokens: 100, outputTokens: 0, totalTokens: 100, cacheReadInputTokens: 92 }); // 92
```
