[**kaboo-react**](../../README.md)

***

# Function: ToolRow()

> **ToolRow**(`__namedParameters`): `Element`

Defined in: [components/ToolRow.tsx:29](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/ToolRow.tsx#L29)

Renders a single [ToolCall](../interfaces/ToolCall.md) as a collapsible row: status icon, label, an
input summary, and — when expanded — the formatted result (a [MiniTable](MiniTable.md)
for tabular JSON, otherwise text). Used inside the [Timeline](Timeline.md).

## Parameters

### \_\_namedParameters

#### tool

[`ToolCall`](../interfaces/ToolCall.md)

## Returns

`Element`

## Example

```tsx
import { ToolRow } from "kaboo-react";
import type { ToolCall } from "kaboo-react";

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
