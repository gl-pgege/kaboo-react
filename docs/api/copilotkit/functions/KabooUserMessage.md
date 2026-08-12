[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooUserMessage()

> **KabooUserMessage**(`props`): `Element`

Defined in: [src/integrations/KabooUserMessage.tsx:149](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooUserMessage.tsx#L149)

Drop-in replacement for `CopilotChatMessageView`'s `userMessage` slot that
renders every reference the user sent as a **non-interactive chip**, so a
reference reads as a reference rather than plain text:

- object references cited inline (`@name`) render as chips *within* the text;
- files and objects added via the `+` tray render as a chip row above the
  bubble (files show a thumbnail/icon + filename).

Object references ride `state.kaboo_references` (not the message content), so
they come from the per-message registry on [useReferences](../../index/functions/useReferences.md) — with a
fallback to the durable per-message metadata recovered from the event stream
([useMessageMeta](../../index/functions/useMessageMeta.md)), so chips survive a reload. Files come from the
message's media parts.

The app's `userMessageFooter` slot (when provided) renders under the bubble.

## Parameters

### props

`CopilotChatUserMessageProps`

## Returns

`Element`
