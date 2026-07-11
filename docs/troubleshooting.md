# Troubleshooting

## Components render unstyled

Import the stylesheet **once**, near your app root:

```ts
import "@kaboo/react/styles.css";
```

Without it, cards, tabs, and the activity panel have no layout or theme. See
[Theming](theming.md) to customize the `--kaboo-*` tokens.

## The activity tree is empty

Activity comes from `ACTIVITY_SNAPSHOT` events on the AG-UI run stream. If
`useActivity()` returns no groups:

- Confirm the backend actually emits activity — an agent served by
  [kaboo-workflows](https://gl-pgege.github.io/kaboo-workflows/) does; a stock
  CopilotKit agent does not.
- Confirm `KabooProvider`'s `runtimeUrl` points at that backend and the request
  isn't blocked (check the network tab / dev-proxy). The
  [minimal example](https://github.com/gl-pgege/@kaboo/react/tree/main/examples/minimal)
  proxies `/api` to `http://localhost:4000`.
- A plain-agent entry renders inline in the chat (`inlineChatOwner`), so you may
  see cards inside the chat rather than a separate panel — that's expected.

## Peer / version errors

kaboo-react needs `react`, `react-dom`, and `@copilotkit/react-core` (**>= 1.62**)
as peers. Install/upgrade them if you see missing-module or hook-mismatch
errors:

```bash
yarn add react react-dom @copilotkit/react-core
```

A CopilotKit version below 1.62 can cause `KabooProvider` / `CopilotChat`
mismatches — align to a supported version.

## `KabooMessageView` import fails

`KabooMessageView` lives in the CopilotKit subpath barrel:

```ts
import { KabooMessageView } from "@kaboo/react/copilotkit";
```

See [CopilotKit subpath](copilotkit-subpath.md) for what that barrel exports and
why it's separate from the root entry.
