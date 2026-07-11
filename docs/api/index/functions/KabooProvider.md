[**kaboo-react**](../../README.md)

***

# Function: KabooProvider()

> **KabooProvider**(`__namedParameters`): `Element`

Defined in: [context/KabooProvider.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L56)

Batteries-included CopilotKit plugin. Renders `<CopilotKit>` and nests every
kaboo context (activity -> drill -> interrupt bridge) plus the built-in HITL
and inline-card handlers, so integrators drop this once near the root and use
only kaboo-react. Activity rides the AG-UI run stream, so there is no separate
activity endpoint to configure.

## Parameters

### \_\_namedParameters

[`KabooProviderProps`](../interfaces/KabooProviderProps.md)

## Returns

`Element`

## Example

```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooProvider, GlassTabs, DrillDetailView } from "kaboo-react";
import { KabooMessageView } from "kaboo-react/copilotkit";
import "kaboo-react/styles.css";

function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider runtimeUrl="/api/copilotkit" agent={agent} threadId={threadId}>
      <GlassTabs />
      <CopilotChat messageView={KabooMessageView} />
      <DrillDetailView />
    </KabooProvider>
  );
}
```
