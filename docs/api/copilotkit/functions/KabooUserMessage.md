[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooUserMessage()

> **KabooUserMessage**(`props`): `Element`

Defined in: [src/integrations/KabooUserMessage.tsx:134](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooUserMessage.tsx#L134)

Drop-in replacement for `CopilotChatMessageView`'s `userMessage` slot that
renders every reference the user sent as a **non-interactive chip**, so a
reference reads as a reference rather than plain text:

- object references cited inline (`@name`) render as chips *within* the text;
- files and objects added via the `+` tray render as a chip row above the
  bubble (files show a thumbnail/icon + filename).

Object references ride `state.kaboo_references` (not the message content), so
they come from the per-message registry on [useReferences](../../index/functions/useReferences.md); files come
from the message's media parts.

## Parameters

### props

`CopilotChatUserMessageProps`

## Returns

`Element`
