[**@pgege/kaboo-react**](../../README.md)

***

# Function: normalizeResult()

> **normalizeResult**(`result`): `string` \| `null`

Defined in: [formatters/output.ts:115](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/output.ts#L115)

Normalizes a raw result string for display: unwraps one layer of JSON string
encoding, converts escaped `\n` into real newlines, and returns `null` for
empty/undefined input.

## Parameters

### result

`string` \| `undefined`

## Returns

`string` \| `null`

## Example

```ts
import { normalizeResult } from "@pgege/kaboo-react";

normalizeResult('"line one\\nline two"');
// "line one\nline two"
```
