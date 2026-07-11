# Activity panel & drill-down

kaboo-react models agent work as a **tree of groups** and gives you components to
render and navigate it.

## The activity tree

Activity is a set of `StreamGroup`s keyed by group id, exposed by `useActivity()`.
Each group links to its parent via `parentGroup`, forming the hierarchy. Read the
root groups with `topLevelGroups`:

```tsx
import { useActivity, topLevelGroups } from "@kaboo/react";

export function RootAgents() {
  const { groups } = useActivity();
  return <div>{topLevelGroups(groups).length} root agents</div>;
}
```

## Rendering primitives

- **`ActivityPanel`** — renders the current level of the tree as a list of
  `AgentCard`s. Use it for a standalone activity view (outside the chat).
- **`AgentCard`** — one agent run: title, status, task, timeline, result.
- **`Timeline`** — the chronological text/tool stream inside a card.
- **`ToolRow`** — a single tool call (input summary + result).
- **`MiniTable`** — tabular tool results.

```tsx
import { ActivityPanel } from "@kaboo/react";

export function Sidebar() {
  return (
    <aside>
      <ActivityPanel />
    </aside>
  );
}
```

## Drill-down

To let users explore sub-agents, pair the breadcrumb and detail components:

```tsx
import { GlassTabs, DrillDetailView } from "@kaboo/react";

export function DrillArea() {
  return (
    <>
      <GlassTabs />
      <DrillDetailView />
    </>
  );
}
```

- **`GlassTabs`** — breadcrumb of the drill path (renders nothing at the root).
- **`DrillDetailView`** — the drilled-in group's full detail.
- **`useDrill()`** — the navigation state and actions (`drillIn`, `drillUp`,
  `drillToRoot`, `drillToLevel`).

```tsx
import { useDrill } from "@kaboo/react";

export function BackButton() {
  const { drillUp, activeDrill } = useDrill();
  if (!activeDrill) return null;
  return <button onClick={drillUp}>Back</button>;
}
```

## Group helpers

- **`topLevelGroups(groups)`** — the parentless roots.
- **`directChildren(groups, parentId)`** — one level of children.

```ts
import { directChildren } from "@kaboo/react";

export function childCount(
  groups: Parameters<typeof directChildren>[0],
  parentId: string,
) {
  return directChildren(groups, parentId).length;
}
```
