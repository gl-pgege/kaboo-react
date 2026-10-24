[**@pgege/kaboo-react**](../../README.md)

***

# Function: useLiveToolCalls()

> **useLiveToolCalls**(`toolName?`): [`LiveToolCall`](../interfaces/LiveToolCall.md)[]

Defined in: [src/hooks/canvas.ts:63](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L63)

Every sub-agent tool call still running, with its arguments as they stream,
so a canvas can show what is about to change — a widget taking shape while
the agent writes it.

## Parameters

### toolName?

`string` \| `RegExp`

Only calls to this tool, or to tools matching it.

## Returns

[`LiveToolCall`](../interfaces/LiveToolCall.md)[]

## Example

```tsx
import { useLiveToolCalls } from "@pgege/kaboo-react";

function GhostWidgets() {
  const plotting = useLiveToolCalls(/plot_widgets$/);
  return <>{plotting.map((call) => <Ghost key={call.toolCallId} args={call.args} />)}</>;
}
```
