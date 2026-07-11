[**@pgege/kaboo-react**](../../README.md)

***

# Function: DrillDetailView()

> **DrillDetailView**(): `Element`

Defined in: [components/DrillDetailView.tsx:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/DrillDetailView.tsx#L34)

Detail pane for the currently drilled-in group: its task, full timeline
(with delegated sub-agents interleaved at their tool-call position), any
unanchored interrupt prompts, and a "Sub-agents" section for swarm/graph
members. Renders a hidden placeholder at the root. Pair with [GlassTabs](GlassTabs.md).

## Returns

`Element`

## Example

```tsx
import { GlassTabs, DrillDetailView } from "@pgege/kaboo-react";

function DrillArea() {
  return (
    <>
      <GlassTabs />
      <DrillDetailView />
    </>
  );
}
```
