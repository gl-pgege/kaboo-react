# kaboo-react

> React components + hooks for rendering kaboo multi-agent activity in a
> [CopilotKit](https://copilotkit.ai) app, with batteries-included CopilotKit
> integrations.

kaboo-react renders a live, hierarchical view of what your agents are doing —
sub-agent cards, tool calls, streamed tokens, structured outputs, drill-down
navigation, and human-in-the-loop interrupts. Activity rides the **same AG-UI run
stream** as the chat (as `ACTIVITY_SNAPSHOT` events), so there is no separate
endpoint to wire up.

## Install

```bash
yarn add @pgege/kaboo-react
# or
npm install @pgege/kaboo-react
# or
pnpm add @pgege/kaboo-react
```

Peer dependencies: `react`, `react-dom`, `@copilotkit/react-core` (>= 1.62).

Import the stylesheet once, near your app root:

```ts
import "@pgege/kaboo-react/styles.css";
```

## Quick start

<!-- source: examples/minimal/src/App.tsx#quickstart -->
```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooProvider, GlassTabs, DrillDetailView } from "@pgege/kaboo-react";
import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";
import "@pgege/kaboo-react/styles.css";

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider runtimeUrl="/api/copilotkit" agent={agent} threadId={threadId}>
      <GlassTabs />
      <CopilotChat messageView={KabooMessageView} />
      <DrillDetailView />
    </KabooProvider>
  );
}
```

## Next steps

- [Getting started](getting-started.md) — a step-by-step walkthrough.
- [Concepts](concepts.md) — the data model (`ACTIVITY_SNAPSHOT` → `StreamGroup`).
- [Theming](theming.md) — CSS variables and `--kaboo-*` tokens.
- [Structured renderers](structured-renderers.md) — custom UI for schema output.
- [Human-in-the-loop](hitl.md) — approvals, forms, and parallel gates.
- [Activity panel & drill-down](activity-panel.md) — the activity tree.
- [CopilotKit subpath](copilotkit-subpath.md) — the `@pgege/kaboo-react/copilotkit` barrel.
- [Troubleshooting](troubleshooting.md) — styles, empty tree, peer versions.
- [API inventory](api-inventory.md) and the [API reference](api/README.md).

## The kaboo stack

kaboo-react is the UI layer. It pairs with
[kaboo-workflows](https://gl-pgege.github.io/kaboo-workflows/) (agent
orchestration) and [kaboo-runtime](https://gl-pgege.github.io/kaboo-runtime/)
(persistence). See [the kaboo stack](https://gl-pgege.github.io/kaboo-docs/) for
the whole picture.
