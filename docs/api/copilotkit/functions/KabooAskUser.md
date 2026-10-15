[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooAskUser()

> **KabooAskUser**(`__namedParameters`): `null`

Defined in: [src/integrations/KabooAskUser.tsx:28](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooAskUser.tsx#L28)

Renders `ask_user` prompts inline in the chat, anchored to the tool call: the
live multiple-choice form while the question waits, then the question and the
person's answer once it resolves. The tool call is a permanent part of the
transcript, so the Q&A persists in chronological order and survives a
reload/replay.

The chat-level interrupt slot defers to this anchor whenever the pending tool
is in the activity groups, so for an agent whose tools render in the chat
(no agent card of its own) this is the only surface for the live form.

## Parameters

### \_\_namedParameters

#### agentId?

`string`

## Returns

`null`
