[**@pgege/kaboo-react**](../../README.md)

***

# Function: ToolRow()

> **ToolRow**(`__namedParameters`): `Element`

Defined in: [src/components/ToolRow.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ToolRow.tsx#L31)

Renders a single [ToolCall](../interfaces/ToolCall.md) as a collapsible row: status icon, label (the
tool's name read as words when it has no label), an input summary, and — when
expanded — the input and result laid out as fields and tables, never JSON.
Used inside the [Timeline](Timeline.md).

## Parameters

### \_\_namedParameters

#### tool

[`ToolCall`](../interfaces/ToolCall.md)

## Returns

`Element`

## Example

```tsx
import { ToolRow } from "@pgege/kaboo-react";
import type { ToolCall } from "@pgege/kaboo-react";

const tool: ToolCall = {
  toolUseId: "t1",
  toolName: "run_sql",
  toolInput: { query: "select 1" },
  status: "done",
};

function Example() {
  return <ToolRow tool={tool} />;
}
```
