# kaboo-react

Reusable React components and hooks for rendering [kaboo-workflows](https://github.com/kaboo/kaboo-workflows) multi-agent activity in a [CopilotKit](https://copilotkit.ai) app.

It renders a live, hierarchical view of what your agents are doing — sub-agent
cards, tool calls, streamed tokens, structured outputs, drill-down navigation,
and human-in-the-loop interrupts — by subscribing to the server's
`/activity-stream` SSE endpoint.

## Install

```bash
npm install kaboo-react
```

Peer dependencies: `react`, `react-dom`, and `@copilotkit/react-core` (>= 1.62).

Import the stylesheet once:

```ts
import "kaboo-react/styles.css";
```

## Quick start

Wrap your app in a single `KabooProvider`, then drop in the components.

```tsx
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";
import {
  KabooProvider,
  DrillDetailView,
  GlassTabs,
} from "kaboo-react";
import { KabooInlineCards, KabooInterruptHandler } from "kaboo-react/copilotkit";
import "kaboo-react/styles.css";

function App({ entry }: { entry: string }) {
  return (
    <KabooProvider activityUrl="/api/activity-stream" entryAgent={entry}>
      <CopilotKit runtimeUrl="/api/copilotkit" agent={entry} useSingleEndpoint={false}>
        {/* inline sub-agent cards inside chat messages */}
        <KabooInlineCards />
        {/* approval / input requests, mirrored into the drill view */}
        <KabooInterruptHandler agentId={entry} />

        <GlassTabs />
        <CopilotChat />
        <DrillDetailView />
      </CopilotKit>
    </KabooProvider>
  );
}
```

`KabooProvider` composes the three contexts (`KabooActivityProvider`,
`DrillProvider`, `InterruptBridgeProvider`) in the correct order so you don't
have to nest them by hand.

## Multiple conversations

Pass a `threadId` so the client only receives that conversation's activity
(the server scopes `/activity-stream` by `threadId`):

```tsx
<KabooProvider activityUrl="/api/activity-stream" entryAgent={entry} threadId={threadId}>
```

Omit `threadId` for the merged, single-tenant view.

## Theming

Components read standard design-system CSS variables (`--background`,
`--foreground`, `--card`, `--muted`, `--border`, …) and fall back to neutral
defaults. Override any token by setting the matching `--kaboo-*` variable on a
parent element:

```css
:root {
  --kaboo-running: #d97706;
  --kaboo-warning: #f59e0b;
  --kaboo-success: #16a34a;
}
```

## Exports

| Export | Purpose |
| --- | --- |
| `KabooProvider` | Single composed provider (activity + drill + interrupt bridge). |
| `KabooActivityProvider` | Subscribes to the activity SSE stream. |
| `DrillProvider` / `useDrill` | Drill-down navigation state. |
| `InterruptBridgeProvider` / `useInterruptBridge` | Surfaces the active interrupt to the drill view. |
| `ActivityPanel`, `AgentCard`, `Timeline`, `ToolRow`, `MiniTable` | Activity rendering primitives. |
| `GlassTabs`, `DrillDetailView` | Breadcrumb + drill-down detail view. |
| `InterruptRenderer` | Default approval / form interrupt UI. |
| `topLevelGroups`, `directChildren` | Group-hierarchy helpers. |
| `kaboo-react/copilotkit` → `KabooInlineCards`, `KabooInterruptHandler` | CopilotKit integrations. |

## License

MIT
