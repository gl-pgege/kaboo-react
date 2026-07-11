[**kaboo-react**](../../README.md)

***

# Function: normalizeResult()

> **normalizeResult**(`result`): `string` \| `null`

Defined in: [formatters/output.ts:115](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/formatters/output.ts#L115)

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
import { normalizeResult } from "kaboo-react";

normalizeResult('"line one\\nline two"');
// "line one\nline two"
```
