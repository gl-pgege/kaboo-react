# Generative UI

CopilotKit draws UI from what an agent streams. kaboo-react passes its
generative UI settings through to `<CopilotKit>` and labels what sub-agents
render, so every tier works from any agent:

| Tier | What it is | Where you configure it |
|---|---|---|
| Your components | A renderer per tool name, drawn as the call streams. | `useRenderTool`, or `renderToolCalls` ([Custom tool cards](tool-cards.md)) |
| A2UI | Declarative surfaces built from a catalog of your components. | `a2ui`, plus an activity renderer |
| Open Generative UI | A one-off visual in a sandboxed iframe. | `openGenerativeUI` |
| MCP Apps | An app an MCP server ships, rendered in a sandbox. | Nothing: CopilotKit's built-in renderer draws it. |

## Wiring

```tsx no-verify
import { createA2UIMessageRenderer } from "@copilotkit/react-core/v2";
import { KabooProvider } from "@pgege/kaboo-react";
import { KabooChat, withSubagentLabel } from "@pgege/kaboo-react/copilotkit";
import { catalog, theme } from "./a2ui";
import { openGenerativeUI } from "./ogui";

const a2uiRenderer = createA2UIMessageRenderer({
  theme,
  catalog,
  onAction: (action) => (action.name === "add_to_dashboard" ? null : undefined),
});
const ACTIVITY_RENDERERS = [withSubagentLabel(a2uiRenderer)];
const A2UI = { catalog };

export function Page({ threadId }: { threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent="kaboo"
      threadId={threadId}
      a2ui={A2UI}
      openGenerativeUI={openGenerativeUI}
      renderActivityMessages={ACTIVITY_RENDERERS}
    >
      <KabooChat />
    </KabooProvider>
  );
}
```

- **`a2ui`** sends your catalog to the agent as context and turns A2UI on in
  the runtime. The agent calls `render_a2ui` when its workflow allows it, and the
  surface paints as the call streams.
- **`renderActivityMessages`** takes precedence over CopilotKit's built-in
  renderers. Pass your own A2UI renderer to handle actions in the browser: an
  `onAction` that returns `null` handles the action; one that returns
  `undefined` sends it to the agent, which reads it as the person's turn.
- **`withSubagentLabel`** wraps an activity renderer so a surface a sub-agent
  rendered shows the agent's name above it, as its questions do. Surfaces from
  the agent answering the chat stay unlabelled.
- **`openGenerativeUI`** turns on sandboxed visuals. Give the sandbox read-only
  functions that fetch data by id, and a design skill so the visual matches your
  app.

Keep the arrays and objects you pass stable (module-level, or memoized):
CopilotKit expects stable renderer lists.

## Widgets by reference

A catalog component should take an id — a saved query's — and fetch its own
rows, rather than receive the data in the surface. The surface stays small, its
figures stay live, and the same widget can move onto a dashboard unchanged.

Lab scenarios:
[a2ui-inline](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/a2ui-inline.yaml),
[a2ui-subagent](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/a2ui-subagent.yaml),
[a2ui-action](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/a2ui-action.yaml),
[ogui-visual](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/ogui-visual.yaml),
[mcp-partner](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/mcp-partner.yaml)
and
[viewer-parity](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/viewer-parity.yaml).
