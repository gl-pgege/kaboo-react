[**@kaboo/react**](../../README.md)

***

# Function: ActivityPanel()

> **ActivityPanel**(): `Element` \| `null`

Defined in: [components/ActivityPanel.tsx:26](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/ActivityPanel.tsx#L26)

Standalone panel that renders the current activity tree as a list of
[AgentCard](AgentCard.md)s — top-level groups at the root, or the drilled-in group's
children. Use it when you want the hierarchical activity view outside the chat
transcript (the in-chat view is handled by `KabooMessageView`). Renders
nothing when there is no activity.

## Returns

`Element` \| `null`

## Example

```tsx
import { ActivityPanel } from "@kaboo/react";

function Sidebar() {
  return (
    <aside>
      <ActivityPanel />
    </aside>
  );
}
```
