[**@pgege/kaboo-react**](../../README.md)

***

# Variable: KabooMessageView

> `const` **KabooMessageView**: (`__namedParameters`) => `Element` & `object`

Defined in: [src/integrations/KabooMessageView.tsx:168](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooMessageView.tsx#L168)

Drop-in replacement for `CopilotChat`'s `messageView` that renders swarm/graph
member cards **live, inside the chat, from the moment the first agent starts**
— not only once the final answer streams.

Why this exists: cards attached purely to the assistant message
([KabooAssistantMessage](../functions/KabooAssistantMessage.md)) can't appear until an assistant bubble exists,
which for a swarm/graph is when the `chat_output` node streams — i.e. at the
very end. During the earlier nodes (planner, researcher, …) there is no
assistant message, so the chat would show only a spinner while real work is
happening.

This view renders the normal message list (with [KabooAssistantMessage](../functions/KabooAssistantMessage.md)
for settled turns) and, beneath it, an "in-progress" block for any run whose
activity groups have appeared but which has **no assistant bubble yet**. As
soon as the run's assistant message mounts, that run becomes "covered" and its
cards render inside the message instead — so there's a seamless hand-off with
no duplication.

App-supplied [KabooSlots](../../index/interfaces/KabooSlots.md) (from `KabooProvider` or the `slots` prop)
plug in here: `runStartIndicator` replaces the bare cursor shown between
send and the first activity, and `turnFooter` / message footers render via
[KabooAssistantMessage](../functions/KabooAssistantMessage.md) / [KabooUserMessage](../functions/KabooUserMessage.md).

Wire it via the `messageView` slot of `CopilotChat`:

## Type Declaration

### Cursor

> **Cursor**: (`__namedParameters`) => `Element` = `CopilotChatMessageView.Cursor`

The streaming cursor slot, re-exported from CopilotKit so `KabooMessageView`
is a drop-in `messageView` (the slot expects a component carrying `Cursor`).

#### Parameters

##### \_\_namedParameters

`HTMLAttributes`\<`HTMLDivElement`\>

#### Returns

`Element`

## Example

```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";

function Chat() {
  return <CopilotChat messageView={KabooMessageView} />;
}
```
