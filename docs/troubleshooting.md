# Troubleshooting

## Components render unstyled

Import the stylesheet **once**, near your app root:

```ts
import "@pgege/kaboo-react/styles.css";
```

Without it, cards, tabs, and the activity panel have no layout or theme. See
[Theming](theming.md) to customize the `--kaboo-*` tokens.

## The activity tree is empty

Groups come from `SUBAGENT_*` events on the AG-UI run stream. If
`useActivity()` returns no groups:

- Confirm the agent delegates — a plain agent with no sub-agents has no groups;
  its work is the chat itself.
- Confirm the backend emits sub-agent events — an agent served by
  [kaboo-workflows](https://gl-pgege.github.io/kaboo-workflows/) 0.29 or later
  does.
- Confirm `KabooProvider`'s `runtimeUrl` points at that backend and the request
  isn't blocked (check the network tab / dev-proxy). The
  [minimal example](https://github.com/gl-pgege/kaboo-react/tree/main/examples/minimal)
  proxies `/api` to `http://localhost:4000`.

## Approval cards stay "Response submitted"

The answers were sent but never reached the agent: the host refused a decision,
or the run failed before the agent started. Before 0.11.2 the cards stayed
answered until a reload. From 0.11.2 they come back to be answered again, with
the reason above them (see
[When an answer can't be recorded](hitl.md#when-an-answer-cant-be-recorded)).
Pair it with kaboo-runtime 0.7.1 or later, which opens such runs with
`RUN_STARTED`. Then fix the refusal itself on the host.

## Peer / version errors

kaboo-react needs `react`, `react-dom`, and `@copilotkit/react-core` (**>= 1.79.1**)
as peers. Install/upgrade them if you see missing-module or hook-mismatch
errors:

```bash
yarn add react react-dom @copilotkit/react-core
```

A CopilotKit version below 1.79.1 can cause `KabooProvider` / `CopilotChat`
mismatches — align to a supported version, or stay on kaboo-react 0.10 for
CopilotKit 1.62 to 1.71.1.

## `KabooMessageView` import fails

`KabooMessageView` lives in the CopilotKit subpath barrel:

```ts
import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";
```

See [CopilotKit subpath](copilotkit-subpath.md) for what that barrel exports and
why it's separate from the root entry.
