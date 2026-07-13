# kaboo-react

> React components + hooks for rendering kaboo multi-agent activity in a
> [CopilotKit](https://copilotkit.ai) app, with batteries-included CopilotKit
> integrations.

[![npm version](https://img.shields.io/npm/v/kaboo-react.svg)](https://www.npmjs.com/package/kaboo-react)
[![license](https://img.shields.io/npm/l/kaboo-react.svg)](./LICENSE)
[![docs](https://img.shields.io/badge/docs-mkdocs-blue.svg)](https://gl-pgege.github.io/kaboo-react/)
[![CI](https://github.com/gl-pgege/kaboo-react/actions/workflows/ci.yml/badge.svg)](https://github.com/gl-pgege/kaboo-react/actions/workflows/ci.yml)

kaboo-react renders a live, hierarchical view of what your agents are doing —
sub-agent cards, tool calls, streamed tokens, structured outputs, drill-down
navigation, and human-in-the-loop interrupts. Activity rides the **same AG-UI run
stream** as the chat (as `ACTIVITY_SNAPSHOT` events), so there is no separate
endpoint to wire up: kaboo-react is a batteries-included CopilotKit plugin.

## Features

- **Live hierarchical activity** — nested agent/tool cards that stream in as work
  happens, inside the chat transcript.
- **Drill-down navigation** — breadcrumb + detail view to explore any sub-agent.
- **Human-in-the-loop** — approval gates and forms, with N parallel interrupts
  resolved independently.
- **Structured renderers** — plug custom UI for schema-shaped agent output.
- **References & attachments** — files and your own objects (tables, dashboards,
  …) as interactive inline chips, added from one shared **+** / **@** popover.
- **Batteries included** — one `KabooProvider` renders `<CopilotKit>` and mounts
  every context and handler for you.
- **Themeable** — styled with CSS variables and `--kaboo-*` tokens.

## Install

```bash
yarn add @pgege/kaboo-react
```

Peer dependencies: `react`, `react-dom`, and `@copilotkit/react-core` (>= 1.62).

Import the stylesheet once, near your app root:

```ts
import "@pgege/kaboo-react/styles.css";
```

## Quick start

`KabooProvider` renders `<CopilotKit>` for you and mounts every kaboo context and
handler inside it. Give it the runtime URL, the entry agent, and a thread id —
then drop in the components.

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

That's it — `KabooProvider` nests the three contexts (`KabooActivityProvider`,
`DrillProvider`, `InterruptBridgeProvider`) plus the built-in `KabooInlineCards`
and `KabooInterruptHandler`. Disable the auto-mounted handlers with
`disableInlineCards` / `disableInterruptHandler`, and forward extra CopilotKit
props via `copilotKitProps`.

## Core concepts

- **Activity rides the run stream.** The backend emits activity as
  `ACTIVITY_SNAPSHOT` events on the same AG-UI run stream as the chat, so there is
  no separate activity endpoint. `KabooActivityProvider` subscribes to the
  CopilotKit agent and exposes it via `useActivity()`.
- **Providers nest under `KabooProvider`.** Activity → drill → interrupt bridge,
  with the built-in handlers mounted inside.
- **Two barrels.** Import framework-agnostic pieces from `kaboo-react`, and the
  CopilotKit-coupled integrations from `@pgege/kaboo-react/copilotkit`.
- **The `threadId` scopes everything.** Each conversation gets its own
  hierarchical activity view automatically.
- **Theming via CSS variables.** Components read standard design-system tokens and
  accept `--kaboo-*` overrides.

## References & attachments

Let users attach things to a message. Everything is driven by **reference
providers** registered on `<KabooProvider references={…}>` and rendered by the
`KabooReferenceInput` slot. There are two transports:

- **Attachment** — a file/blob. Register the built-in `uploadProvider({ onUpload })`;
  choosing "Attach a file" (from **+** or **@**) opens the picker, uploads, and
  drops a file chip inline. Files ride the message as parts stamped with
  `kaboo_id` / `kaboo_kind` / `kaboo_name`.
- **Object** — a pointer to one of *your* entities (`table`, `dashboard`, …).
  Register a `ReferenceProvider`; selected objects sync into
  `state.kaboo_references` for the backend to resolve, and appear inline as
  `@name`.

```tsx no-verify
import {
  KabooProvider,
  KabooReferenceInput,
  uploadProvider,
  type ReferenceProvider,
} from "@pgege/kaboo-react";

// A custom object reference: three fields make it work.
const tableProvider: ReferenceProvider = {
  id: "table",
  label: "Tables",
  icon: <Table2 size={16} />,
  search: (q) => TABLES.filter((t) => t.label.includes(q)),          // items under @
  toReference: (item) => ({ transport: "object", kind: "table", id: item.id, name: item.label }),
};

<KabooProvider
  runtimeUrl="/api/copilotkit"
  agent={agent}
  references={[uploadProvider({ accept: "image/*,.pdf", onUpload }), tableProvider]}
>
  <CopilotChat input={KabooReferenceInput} messageView={KabooMessageView} />
</KabooProvider>;
```

`KabooReferenceInput` is a drop-in `<CopilotChat input={…}>` slot. It keeps
CopilotKit's native input chrome (send button, disclaimer, theme) but swaps the
plain textarea for a lightweight editor where every reference renders as an
**interactive inline chip**: click a chip to swap it for another, or its `×` to
remove it. The **+** button and the **@** key open the *same* searchable
popover; it dismisses on outside-click / `Escape`. On submit the editor builds
the multimodal message (files as attachment parts, objects on
`state.kaboo_references`, cleared only after the run starts) and runs the agent.
`onUpload` should return a fetchable URL (not base64) so the transport and
persisted event log stay small. See [References & providers](./docs/references.md)
for the full provider contract (both transports, searchable vs action-only,
`toReference`), and kaboo-workflows' *Attachments & Multimodal* chapter for how
references reach each agent.

## Guides

- [Getting started](./docs/getting-started.md)
- [References & providers](./docs/references.md)
- [Theming](./docs/theming.md)
- [Structured renderers](./docs/structured-renderers.md)
- [Human-in-the-loop](./docs/hitl.md)
- [Activity panel & drill-down](./docs/activity-panel.md)
- [The `@pgege/kaboo-react/copilotkit` subpath](./docs/copilotkit-subpath.md)

## API reference

Full, auto-generated API docs for both barrels live on the
[documentation site](https://gl-pgege.github.io/kaboo-react/api/). A flat index
of every public export is in [docs/api-inventory.md](./docs/api-inventory.md).

## Examples

- [`examples/minimal`](./examples/minimal) — the smallest end-to-end wiring
  (this README's quick start).
- The [kaboo-workflows-demo](https://github.com/gl-pgege/kaboo-docs/tree/main/examples/kaboo-workflows-demo)
  frontend is the canonical, production-shaped consumer.

## Compatibility & versioning

- **React** 18 and 19 (`react` / `react-dom` >= 18 as peer deps).
- **CopilotKit** `@copilotkit/react-core` >= 1.62 (peer dep).
- Follows [semantic versioning](https://semver.org). See
  [CHANGELOG.md](./CHANGELOG.md).

## The kaboo stack

kaboo-react is one of three libraries:

- [kaboo-workflows](https://github.com/gl-pgege/kaboo-workflows) — Python
  multi-agent orchestration.
- [kaboo-runtime](https://github.com/gl-pgege/kaboo-runtime) — CopilotKit runtime
  persistence/orchestration plugin.
- **kaboo-react** — this library, the UI layer.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) (humans) and [AGENTS.md](./AGENTS.md)
(AI contributors).

## License

MIT — see [LICENSE](./LICENSE).
