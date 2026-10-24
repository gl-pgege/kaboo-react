[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooChat()

> **KabooChat**(`props`): `Element`

Defined in: [src/integrations/KabooChat.tsx:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooChat.tsx#L43)

The chat panel: `<CopilotChat>` with kaboo's transcript, plus the drill-down
tabs and detail view for sub-agents. Its composer sends through
[useKabooSend](../../index/functions/useKabooSend.md), so a new message skips any open request. Place it anywhere under
`KabooProvider`, which can sit at the route so canvases beside the chat
share the agent.

## Parameters

### props

[`KabooChatProps`](../type-aliases/KabooChatProps.md)

## Returns

`Element`

## Example

```tsx
import { KabooProvider } from "@pgege/kaboo-react";
import { KabooChat } from "@pgege/kaboo-react/copilotkit";

export function Page({ threadId }: { threadId: string }) {
  return (
    <KabooProvider runtimeUrl="/api/copilotkit" agent="kaboo" threadId={threadId}>
      <KabooChat />
    </KabooProvider>
  );
}
```
