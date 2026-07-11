# Structured renderers

Agents can emit **structured output** — a schema-shaped JSON object plus the
schema's name. Structured renderers let you render that object with a custom React
component instead of the default collapsible JSON view.

## What they are

A `StructuredRenderers` map is keyed by the output schema name. Each renderer
receives the structured output object (`Record<string, unknown>`) and returns a
`ReactElement`:

```ts
import { createElement } from "react";
import type { StructuredRenderers } from "@kaboo/react";

const renderers: StructuredRenderers = {
  WeatherReport: (data) => createElement("div", null, String(data.summary)),
};
```

## Provide renderers

Pass the map to `KabooProvider` (or `KabooActivityProvider` if you compose
providers by hand):

```tsx
import { KabooProvider } from "@kaboo/react";
import type { StructuredRenderers } from "@kaboo/react";

const renderers: StructuredRenderers = {
  WeatherReport: (data) => <div>Summary: {String(data.summary)}</div>,
};

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      structuredRenderers={renderers}
    >
      <div />
    </KabooProvider>
  );
}
```

## How a renderer is selected

When an activity group carries both `structuredOutput` (the data) and
`outputSchemaName` (the key), kaboo-react looks up `renderers[outputSchemaName]`:

- **Match found** → your component renders the data.
- **No match** → a collapsible "Structured output (`<schemaName>`)" JSON view is
  shown instead.

This means you can add renderers incrementally: unrendered schemas degrade
gracefully to JSON.
