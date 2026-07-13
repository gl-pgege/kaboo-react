[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: StructuredRenderers

> **StructuredRenderers** = `Record`\<`string`, (`data`) => `ReactElement`\>

Defined in: [src/context/ActivityProvider.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L21)

A map of custom renderers for structured agent output, keyed by the output
schema name. When a group carries `structuredOutput` and a matching
`outputSchemaName`, its renderer is used instead of the default JSON view.

## Example

```tsx
import type { StructuredRenderers } from "@pgege/kaboo-react";

const renderers: StructuredRenderers = {
  WeatherReport: (data) => <div>{String(data.summary)}</div>,
};
```
