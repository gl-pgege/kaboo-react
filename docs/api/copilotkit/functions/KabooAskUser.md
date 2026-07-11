[**kaboo-react**](../../README.md)

***

# Function: KabooAskUser()

> **KabooAskUser**(`__namedParameters`): `null`

Defined in: [integrations/KabooAskUser.tsx:28](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/integrations/KabooAskUser.tsx#L28)

Renders answered `ask_user` prompts inline in the chat, anchored to the tool
call. The tool call is a permanent part of the transcript, so the question and
the user's answer persist in chronological order after the interrupt resolves.

While the prompt is still pending (no result yet), this renders nothing — the
live interactive form is supplied by [KabooInterruptHandler](KabooInterruptHandler.md)'s
`useInterrupt` render.

## Parameters

### \_\_namedParameters

#### agentId?

`string`

## Returns

`null`
