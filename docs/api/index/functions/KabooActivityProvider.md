[**kaboo-react**](../../README.md)

***

# Function: KabooActivityProvider()

> **KabooActivityProvider**(`__namedParameters`): `Element`

Defined in: [context/ActivityProvider.tsx:62](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L62)

Reads kaboo's hierarchical activity from the AG-UI run stream. The backend
emits it as `ACTIVITY_SNAPSHOT` events interleaved on `/invocations`, so we
subscribe to the CopilotKit agent instead of a separate SSE endpoint.

Included automatically by [KabooProvider](KabooProvider.md); mount it yourself only when
composing providers by hand under an existing `<CopilotKit>`.

## Parameters

### \_\_namedParameters

[`KabooActivityProviderProps`](../interfaces/KabooActivityProviderProps.md)

## Returns

`Element`

## Example

```tsx
import { KabooActivityProvider, ActivityPanel } from "kaboo-react";

function Activity({ agent }: { agent: string }) {
  return (
    <KabooActivityProvider agentId={agent}>
      <ActivityPanel />
    </KabooActivityProvider>
  );
}
```
