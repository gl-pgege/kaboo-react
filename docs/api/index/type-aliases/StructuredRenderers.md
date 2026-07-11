[**kaboo-react**](../../README.md)

***

# Type Alias: StructuredRenderers

> **StructuredRenderers** = `Record`\<`string`, (`data`) => `ReactElement`\>

Defined in: [context/ActivityProvider.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/ActivityProvider.tsx#L21)

A map of custom renderers for structured agent output, keyed by the output
schema name. When a group carries `structuredOutput` and a matching
`outputSchemaName`, its renderer is used instead of the default JSON view.

## Example

```tsx
import type { StructuredRenderers } from "kaboo-react";

const renderers: StructuredRenderers = {
  WeatherReport: (data) => <div>{String(data.summary)}</div>,
};
```
