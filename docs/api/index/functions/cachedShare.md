[**@pgege/kaboo-react**](../../README.md)

***

# Function: cachedShare()

> **cachedShare**(`usage`): `number` \| `null`

Defined in: [src/formatters/tokens.ts:54](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/tokens.ts#L54)

Returns the share of the prompt read from the provider's cache as a whole
percentage (`0`–`100`), or `null` when the usage carries no cache reads.

Bedrock and Anthropic count uncached input, cache reads and cache writes
separately, so the prompt is the sum of the three.

## Parameters

### usage

#### cacheReadInputTokens?

`number`

#### cacheWriteInputTokens?

`number`

#### inputTokens

`number`

## Returns

`number` \| `null`

## Example

```ts
import { cachedShare } from "@pgege/kaboo-react";

cachedShare({ inputTokens: 100, cacheReadInputTokens: 300, cacheWriteInputTokens: 100 }); // 60
```
