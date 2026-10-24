[**@pgege/kaboo-react**](../../README.md)

***

# Function: useAgentPresence()

> **useAgentPresence**(): [`AgentPresence`](../interfaces/AgentPresence.md)[]

Defined in: [src/hooks/canvas.ts:115](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L115)

The sub-agents working right now, and what each is running, so a canvas can
show who is touching what.

## Returns

[`AgentPresence`](../interfaces/AgentPresence.md)[]

## Example

```tsx
import { useAgentPresence } from "@pgege/kaboo-react";

function Presence() {
  const working = useAgentPresence();
  return <>{working.map((agent) => <span key={agent.subagentRunId}>{agent.title}</span>)}</>;
}
```
