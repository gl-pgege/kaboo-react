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
import type { StructuredRenderers } from "@pgege/kaboo-react";

const renderers: StructuredRenderers = {
  WeatherReport: (data) => createElement("div", null, String(data.summary)),
};
```

## Provide renderers

Pass the map to `KabooProvider` (or `KabooActivityProvider` if you compose
providers by hand):

```tsx
import { KabooProvider } from "@pgege/kaboo-react";
import type { StructuredRenderers } from "@pgege/kaboo-react";

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

A sub-agent's `SUBAGENT_FINISHED` carries its result and, for a structured
output, the schema's name (`metadata.outputSchema`, kaboo-workflows 0.29 or
later). kaboo-react keeps them on the group as `structuredOutput` (the data) and
`outputSchemaName` (the key), and looks up `renderers[outputSchemaName]`:

- **Match found** → your component renders the data.
- **No match** → a collapsible "Structured output (`<schemaName>`)" view shows
  the data as a readable list.

This means you can add renderers incrementally: unrendered schemas still read
well without one.

To replace how a *tool call* draws rather than how a result object draws, see
[custom tool cards](tool-cards.md).
