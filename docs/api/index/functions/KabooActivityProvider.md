[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooActivityProvider()

> **KabooActivityProvider**(`__namedParameters`): `Element`

Defined in: [src/context/ActivityProvider.tsx:94](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L94)

Builds the sub-agent groups the cards render from the AG-UI run stream: each
`SUBAGENT_STARTED` opens a group, the events tagged with its `subagentRunId`
fill its timeline, and `SUBAGENT_FINISHED` or `SUBAGENT_ERROR` settles it.
The same fold runs live and on replay.

Included automatically by [KabooProvider](KabooProvider.md); mount it yourself only when
composing providers by hand under an existing `<CopilotKit>`.

## Parameters

### \_\_namedParameters

[`KabooActivityProviderProps`](../interfaces/KabooActivityProviderProps.md)

## Returns

`Element`

## Example

```tsx
import { KabooActivityProvider, ActivityPanel } from "@pgege/kaboo-react";

function Activity({ agent }: { agent: string }) {
  return (
    <KabooActivityProvider agentId={agent}>
      <ActivityPanel />
    </KabooActivityProvider>
  );
}
```
