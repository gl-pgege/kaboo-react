# kaboo-react — minimal example

The smallest end-to-end wiring of `kaboo-react`: a `KabooProvider` wrapping a
`CopilotChat` (with `KabooMessageView`), plus `GlassTabs` + `DrillDetailView` for
drill-down. This is the same pattern documented in the
[Quick start](https://gl-pgege.github.io/kaboo-react/#quick-start).

## What it shows

- Mounting the batteries-included `KabooProvider` (renders `<CopilotKit>` and all
  kaboo contexts + handlers for you).
- Rendering live, hierarchical agent activity **inside the chat** via
  `KabooMessageView`.
- Breadcrumb + detail drill-down with `GlassTabs` and `DrillDetailView`.
- Importing the stylesheet with `import "kaboo-react/styles.css"`.

## Prerequisites

You need a running **CopilotKit runtime endpoint** that streams kaboo activity as
`ACTIVITY_SNAPSHOT` events. The
[kaboo-workflows-demo](../../../kaboo-workflows-demo) backend (a CopilotKit
runtime backed by [kaboo-runtime](https://github.com/gl-pgege/kaboo-runtime) and
[kaboo-workflows](https://github.com/gl-pgege/kaboo-workflows)) is the canonical
server. Point `runtimeUrl` / the Vite proxy at it.

## Run

```bash
yarn install
yarn dev
```

Then open the printed URL. Update `agent` in `src/main.tsx` to your workflow's
entry agent id (the demo backend serves it at `/api/manifest`).

## A fuller example

For a production-shaped app (theming, manifest loading, layout), see the demo
frontend: [kaboo-workflows-demo/frontend/src/App.tsx](../../../kaboo-workflows-demo/frontend/src/App.tsx).
