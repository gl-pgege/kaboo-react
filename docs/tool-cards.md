# Custom tool cards

By default every tool call draws as a `ToolRow` — name, a summarized input, a
collapsible result. When a tool means something in your app (a SQL query, a
document it wrote, a ticket it opened), you can replace that row with your own
card: your layout, your click handlers, your drawer.

## The two surfaces

A tool call can appear in two places, and each has its own registration point.
Register both if a tool can be called by a plain agent *and* from inside a
delegate or swarm.

| Where | What draws it | How you override |
|-------|---------------|------------------|
| The chat transcript | CopilotKit's tool render slot | `useRenderTool({ name, render })` |
| Activity timelines — agent cards, drill views, sub-agent activity | kaboo's `Timeline` | `toolRenderers` on `KabooProvider` |

## Timelines: `toolRenderers`

Keyed by exact tool name. A match replaces the built-in row everywhere a
`Timeline` draws that tool, at any nesting depth:

```tsx
import { KabooProvider } from "@pgege/kaboo-react";
import type { ToolRenderers, ToolRendererProps } from "@pgege/kaboo-react";

declare function openQueryDrawer(toolCallId: string): void;

function RunSqlCard({ tool }: ToolRendererProps) {
  const input = tool.toolInput as { query?: string } | undefined;
  return (
    <button
      type="button"
      className="my-tool-card"
      disabled={tool.status === "running"}
      onClick={() => openQueryDrawer(tool.toolUseId)}
    >
      <code>{input?.query ?? "…"}</code>
      <span>{tool.status === "running" ? "Running…" : "View results"}</span>
    </button>
  );
}

const toolRenderers: ToolRenderers = { run_sql: RunSqlCard };

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      toolRenderers={toolRenderers}
    >
      <div />
    </KabooProvider>
  );
}
```

`ToolRendererProps` carries one `tool`:

| Field | Use it for |
|-------|-----------|
| `toolUseId` | The stable id. Correlate with your own state, and key anything you open. |
| `toolName` | The machine name that matched. |
| `toolInput` | The raw arguments, as sent. Cast to your tool's shape. |
| `toolResult` | The raw result once it lands; `undefined` while running. |
| `status` | `running` / `done` / `success` / `error` / `cancelled`. |

An approval gate on a gated tool still renders under your card, so a custom
renderer never hides a pending question.

## The transcript: `useRenderTool`

kaboo registers a wildcard renderer that draws any plain tool call inline in the
chat. A renderer registered for an exact name takes precedence over it:

```tsx no-verify
import { useRenderTool } from "@copilotkit/react-core/v2";

function RunSqlTranscriptCard() {
  useRenderTool({
    name: "run_sql",
    render: ({ toolCallId, args, status, result }) => (
      <button type="button" onClick={() => openQueryDrawer(toolCallId)}>
        {status === "complete" ? "View results" : "Running…"}
      </button>
    ),
  });
  return null;
}
```

Mount it anywhere inside `KabooProvider`. Sharing one card between the two
surfaces is usually a matter of writing the card against your own props and
adapting at each registration, since the transcript hands you CopilotKit's
render props and the timeline hands you a `ToolCall`.

## Making a card interactive

The card is ordinary React inside your app's tree, so a click handler may open a
drawer, route, or mutate — nothing has to travel through the agent. Two things
are worth getting right:

- **Key by `toolUseId`, not by tool name or index.** A tool can be called many
  times in one run, and a timeline re-renders as the run streams.
- **Render every status.** `running` arrives before `toolInput` is complete and
  long before `toolResult` exists, so a card that reads the result
  unconditionally will flash empty. Treat the result as the last state, not the
  only one.

If the card needs data the tool call doesn't carry, fetch it in the card from
your own API by the ids in `toolInput` rather than widening the tool's result —
the result is transcript, and it is replayed on every reconnect.

## Choosing between a tool card and structured output

A tool card is right when the *call* is the thing worth showing. When the agent
is producing a result object with a schema — a report, a risk matrix, a table —
use a [structured renderer](structured-renderers.md) instead, keyed by the
schema name rather than the tool name.
