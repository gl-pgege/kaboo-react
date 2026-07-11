# Getting started

!!! note "Compatibility"
    kaboo-react needs **React 18+**, **Node.js 18+**, and
    **`@copilotkit/react-core` >= 1.62** as peers.

This guide wires kaboo-react into a CopilotKit app from scratch.

## Prerequisites

You need a **CopilotKit runtime endpoint** that streams kaboo activity as
`ACTIVITY_SNAPSHOT` events on the AG-UI run stream. The
[kaboo-runtime](https://github.com/gl-pgege/kaboo-runtime) package (a CopilotKit
runtime persistence/orchestration plugin) plus a
[kaboo-workflows](https://github.com/gl-pgege/kaboo-workflows) backend is the
canonical server; the
[kaboo-workflows-demo](https://github.com/gl-pgege/kaboo-workflows-demo) shows a
complete setup.

## Install

```bash
yarn add kaboo-react
# or
npm install kaboo-react
# or
pnpm add kaboo-react
```

Peer dependencies (install if you don't already have them):

```bash
yarn add react react-dom @copilotkit/react-core
```

## Import the stylesheet

Import it once, near your app root:

```ts
import "kaboo-react/styles.css";
```

## Wrap your app in `KabooProvider`

`KabooProvider` renders `<CopilotKit>` and nests every kaboo context and handler.
Pass the runtime URL, the entry agent id, and a thread id:

<!-- source: examples/minimal/src/App.tsx#quickstart -->
```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooProvider, GlassTabs, DrillDetailView } from "kaboo-react";
import { KabooMessageView } from "kaboo-react/copilotkit";
import "kaboo-react/styles.css";

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

## Render the chat with `KabooMessageView`

Pass `KabooMessageView` to `CopilotChat`'s `messageView` slot. It renders the
normal message list **and** live agent activity cards inside the transcript, from
the moment the first agent starts:

```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooMessageView } from "kaboo-react/copilotkit";

export function Chat() {
  return <CopilotChat messageView={KabooMessageView} />;
}
```

## Add drill-down

`GlassTabs` renders a breadcrumb once you drill into a sub-agent, and
`DrillDetailView` renders the selected group's detail. Place them alongside the
chat (as in the quick start above).

## What auto-mounts

`KabooProvider` mounts these for you:

- `KabooInlineCards` — inline delegate sub-agent cards at their tool-call
  position.
- `KabooInterruptHandler` — the human-in-the-loop handler.

Escape hatches:

```tsx
import { KabooProvider } from "kaboo-react";

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      disableInlineCards={false}
      disableInterruptHandler={false}
      copilotKitProps={{}}
    >
      <div />
    </KabooProvider>
  );
}
```

- `disableInlineCards` / `disableInterruptHandler` — skip an auto-mounted handler
  (e.g. to render your own).
- `copilotKitProps` — forward extra props to the underlying `<CopilotKit>`.

## Next steps

- [Concepts](concepts.md) — the data model behind the activity tree.
- [Activity panel & drill-down](activity-panel.md) — render and navigate it.
- [Human-in-the-loop](hitl.md) — approvals, forms, and parallel gates.
- [Troubleshooting](troubleshooting.md) — styles, empty tree, peer versions.
