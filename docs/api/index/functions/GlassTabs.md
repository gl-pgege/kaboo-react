[**kaboo-react**](../../README.md)

***

# Function: GlassTabs()

> **GlassTabs**(): `Element` \| `null`

Defined in: [components/GlassTabs.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/GlassTabs.tsx#L24)

Breadcrumb navigation for the drill-down path: a "Chat" root followed by one
crumb per drilled-in group. Clicking a crumb jumps to that level; the current
(last) crumb is disabled. Renders nothing at the root. Pair with
[DrillDetailView](DrillDetailView.md).

## Returns

`Element` \| `null`

## Example

```tsx
import { GlassTabs, DrillDetailView } from "kaboo-react";

function DrillArea() {
  return (
    <>
      <GlassTabs />
      <DrillDetailView />
    </>
  );
}
```
