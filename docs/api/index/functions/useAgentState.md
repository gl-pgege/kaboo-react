[**@pgege/kaboo-react**](../../README.md)

***

# Function: useAgentState()

> **useAgentState**\<`T`\>(`select?`, `agentId?`): `T`

Defined in: [src/hooks/canvas.ts:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L23)

The agent's shared state, or the part a selector picks — such as the
`kaboo_workspace` the engine writes as tools succeed. Re-renders when the
state changes.

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Parameters

### select?

(`state`) => `T`

Picks the part the component needs; the whole state when omitted.

### agentId?

`string`

The agent; the provider's when omitted.

## Returns

`T`

## Example

```tsx
import { useAgentState } from "@pgege/kaboo-react";

function Focus() {
  const focus = useAgentState((state) => (state.kaboo_workspace as { focus?: { id: string } } | undefined)?.focus);
  return focus ? <span>Kaboo is on {focus.id}</span> : null;
}
```
