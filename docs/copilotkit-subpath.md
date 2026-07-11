# The `kaboo-react/copilotkit` subpath

kaboo-react ships two barrels:

- **`kaboo-react`** — framework-agnostic contexts, hooks, components, and utils.
- **`kaboo-react/copilotkit`** — integrations coupled to CopilotKit's chat
  surfaces.

## Why a separate barrel

The `copilotkit` integrations plug into specific slots of `CopilotChat` and depend
on CopilotKit's v2 APIs. Keeping them behind a subpath makes that coupling
explicit and keeps the main barrel usable in more contexts.

## The exports

| Export | Purpose | Wiring |
| --- | --- | --- |
| `KabooMessageView` | Live in-chat member cards, from the first agent. | `CopilotChat` `messageView` slot. |
| `KabooAssistantMessage` | Cards above a settled assistant reply. | Used by `KabooMessageView` (assistant-message slot). |
| `KabooInlineCards` | Delegate sub-agent cards at the tool-call position. | Auto-mounted by `KabooProvider`. |
| `KabooInterruptHandler` | Human-in-the-loop handler. | Auto-mounted by `KabooProvider`. |
| `KabooAskUser` | Answered `ask_user` prompts, inline. | Used by the interrupt handler. |
| `KabooToolRender` | Wildcard tool renderer. | Used by `KabooInlineCards`. |

Most apps only import **`KabooMessageView`** directly — the rest are auto-mounted
by `KabooProvider`.

## Wiring `KabooMessageView`

```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooMessageView } from "kaboo-react/copilotkit";

export function Chat() {
  return <CopilotChat messageView={KabooMessageView} />;
}
```

`KabooMessageView` is a drop-in `messageView`: it carries a `Cursor` static like
CopilotKit's own message view, so it satisfies the slot type directly.

## Using the handlers yourself

If you disable an auto-mounted handler on `KabooProvider`
(`disableInterruptHandler` / `disableInlineCards`), you can mount your own from
this subpath:

```tsx
import { KabooProvider } from "kaboo-react";
import { KabooInterruptHandler } from "kaboo-react/copilotkit";

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      disableInterruptHandler
    >
      <KabooInterruptHandler agentId={agent} />
    </KabooProvider>
  );
}
```
