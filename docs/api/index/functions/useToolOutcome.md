[**@pgege/kaboo-react**](../../README.md)

***

# Function: useToolOutcome()

> **useToolOutcome**(`toolCallId`): [`ToolOutcome`](../interfaces/ToolOutcome.md) \| `undefined`

Defined in: [src/hooks/useActivity.ts:39](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/useActivity.ts#L39)

How a top-level tool call ended, as the workflow service reported it on the
call's result; `undefined` while it runs, and for results that carry no
status. Sub-agent calls read theirs from [useToolCallMeta](useToolCallMeta.md).

## Parameters

### toolCallId

`string` \| `undefined`

## Returns

[`ToolOutcome`](../interfaces/ToolOutcome.md) \| `undefined`

## Example

```tsx
import { useToolOutcome } from "@pgege/kaboo-react";

function Failed({ toolCallId }: { toolCallId: string }) {
  const outcome = useToolOutcome(toolCallId);
  return outcome?.status === "error" ? <span>{outcome.error}</span> : null;
}
```
