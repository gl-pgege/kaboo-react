[**@pgege/kaboo-react**](../../README.md)

***

# Function: resolveTimelineTool()

> **resolveTimelineTool**(`entry`, `tools`): [`ToolCall`](../interfaces/ToolCall.md) \| `undefined`

Defined in: [src/utils/timeline.ts:36](https://github.com/gl-pgege/kaboo-react/blob/main/src/utils/timeline.ts#L36)

Resolve a timeline tool entry to its [ToolCall](../interfaces/ToolCall.md).

*tools* is the owning group's `tools` list, which holds the single copy the
entry references. Returns `undefined` for a reference with no match, which a
caller should render as nothing rather than as an empty row.

## Parameters

### entry

[`TimelineEntry`](../type-aliases/TimelineEntry.md)

### tools

[`ToolCall`](../interfaces/ToolCall.md)[]

## Returns

[`ToolCall`](../interfaces/ToolCall.md) \| `undefined`

## Example

```ts
import { resolveTimelineTool } from "@pgege/kaboo-react";

function firstToolName(group: { tools: ToolCall[]; timeline: TimelineEntry[] }) {
  for (const entry of group.timeline) {
    const tool = resolveTimelineTool(entry, group.tools);
    if (tool) return tool.toolName;
  }
  return null;
}
```
