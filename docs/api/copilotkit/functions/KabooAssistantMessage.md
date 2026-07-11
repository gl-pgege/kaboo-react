[**kaboo-react**](../../README.md)

***

# Function: KabooAssistantMessage()

> **KabooAssistantMessage**(`props`): `Element`

Defined in: [integrations/KabooAssistantMessage.tsx:30](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/integrations/KabooAssistantMessage.tsx#L30)

Drop-in replacement for CopilotKit's assistant-message renderer that prepends
a first-class swarm/graph turn's member cards ABOVE the assistant's text —
inside the chat transcript, as part of the same turn.

Wire it via the `messageView` slot of `CopilotChat`:

```tsx
<CopilotChat messageView={{ assistantMessage: KabooAssistantMessage }} />
```

This is used instead of `renderCustomMessages` because the `CopilotKit`
convenience provider hard-overrides that prop; the `messageView`/
`assistantMessage` slot is the supported customization surface and is not
clobbered.

Which cards to show is decided by the turn binding (provided by
[KabooMessageView](../variables/KabooMessageView.md)), which resolves each reply message to its turn's
member cards — robust to an interrupt/resume splitting the turn across
multiple runIds. Delegate cards keep their tool-call path (they carry a
`toolCallId` and are excluded from `chatRootGroups`).

## Parameters

### props

`CopilotChatAssistantMessageProps`

## Returns

`Element`
