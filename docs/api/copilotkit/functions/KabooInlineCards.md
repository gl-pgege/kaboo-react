[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooInlineCards()

> **KabooInlineCards**(): `Element`

Defined in: [src/integrations/KabooInlineCards.tsx:39](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInlineCards.tsx#L39)

Renders [AgentCard](../../index/functions/AgentCard.md)s inline in the chat for **delegate** sub-agents.

Every delegate group is spawned by a delegate tool call and carries its
`toolCallId`. We register a v2 tool renderer per such agent so CopilotKit
places the card at the tool-call position in the assistant turn, correlated
by `(agentName, toolCallId)`.

First-class swarm/graph entries have no delegating tool call, so their member
cards are rendered by [KabooMessageView](../variables/KabooMessageView.md) / [KabooAssistantMessage](KabooAssistantMessage.md)
instead, anchored to the assistant turn. Groups carrying a `toolCallId` are
excluded there, so the two paths never double-render the same group.

A request a delegate waits on (an approval or a question) reaches the caller
anchored at the delegating call, so it is drawn under that delegate's card.

## Returns

`Element`
