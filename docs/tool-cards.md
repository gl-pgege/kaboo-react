# Custom tool cards

By default every tool call draws as a `ToolRow` — name or label, a summarized
input, a readable result. When a tool means something in your app (a SQL query,
a document it wrote, a ticket it opened), you can replace that row with your own
card: your layout, your click handlers, your drawer.

## Register once

Register a renderer with CopilotKit — `useRenderTool`, or `renderToolCalls` on
`KabooProvider` — and it draws the tool everywhere: in the chat transcript, and
inside every sub-agent's card and drill view, at any depth.

```tsx no-verify
import { useRenderTool } from "@copilotkit/react-core/v2";

declare function openQueryDrawer(toolCallId: string): void;

function RunSqlCard() {
  useRenderTool({
    name: "run_sql",
    render: ({ toolCallId, args, status }) => (
      <button type="button" onClick={() => openQueryDrawer(toolCallId)}>
        <code>{(args as { query?: string }).query ?? "…"}</code>
        {status === "complete" ? "View results" : "Running…"}
      </button>
    ),
  });
  return null;
}
```

Mount it anywhere inside `KabooProvider`. A call that starts a sub-agent is drawn
as that agent's card instead, whatever is registered for its name.

## Draw it while it streams

Tool arguments arrive as the model writes them — from sub-agents as from the
agent answering the chat — so a card can show the SQL as it's written, or a
widget's outline before it's plotted:

- **`inProgress`** — `args` is partial and grows with each update.
- **`executing`** — the arguments are complete and the tool is running.
- **`complete`** — `result` holds what the tool returned.

Render every status. A card that reads the result unconditionally flashes empty
while the call streams.

## The fallback: `toolRenderers`

`toolRenderers` on `KabooProvider` still draws a tool inside sub-agent timelines
when nothing is registered with CopilotKit for its name. It hands you kaboo's
`ToolCall` — `toolUseId`, `toolName`, `toolLabel`, `toolInput`, `toolResult`,
`status` — rather than CopilotKit's render props:

```tsx
import { KabooProvider } from "@pgege/kaboo-react";
import type { ToolRenderers, ToolRendererProps } from "@pgege/kaboo-react";

declare function openQueryDrawer(toolCallId: string): void;

function RunSqlRow({ tool }: ToolRendererProps) {
  const input = tool.toolInput as { query?: string } | undefined;
  return (
    <button type="button" disabled={tool.status === "running"} onClick={() => openQueryDrawer(tool.toolUseId)}>
      <code>{input?.query ?? "…"}</code>
    </button>
  );
}

const toolRenderers: ToolRenderers = { run_sql: RunSqlRow };

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider runtimeUrl="/api/copilotkit" agent={agent} threadId={threadId} toolRenderers={toolRenderers}>
      <div />
    </KabooProvider>
  );
}
```

An approval on a gated tool still renders with your card, so a custom renderer
never hides a pending question.

## Making a card interactive

The card is ordinary React inside your app's tree, so a click handler may open a
drawer, route, or mutate — nothing has to travel through the agent. Two things
are worth getting right:

- **Key by the call's id, not by tool name or index.** A tool can be called many
  times in one run, and a timeline re-renders as the run streams.
- **Fetch by reference.** If the card needs data the tool call doesn't carry,
  fetch it in the card from your own API by the ids in the arguments rather than
  widening the tool's result — the result is transcript, and it is replayed on
  every reconnect.

## Choosing between a tool card and structured output

A tool card is right when the *call* is the thing worth showing. When the agent
is producing a result object with a schema — a report, a risk matrix, a table —
use a [structured renderer](structured-renderers.md) instead, keyed by the
schema name rather than the tool name.

Lab scenarios:
[plain-dashboard](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/plain-dashboard.yaml)
and
[delegate-dashboard](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/delegate-dashboard.yaml).
