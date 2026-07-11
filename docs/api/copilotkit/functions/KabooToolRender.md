[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooToolRender()

> **KabooToolRender**(): `null`

Defined in: [integrations/KabooToolRender.tsx:45](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooToolRender.tsx#L45)

Wildcard (`"*"`) tool-call renderer: persists any plain tool call inline in
the chat transcript. Tools with a dedicated renderer (`ask_user`, delegate
sub-agents) take precedence and never reach this fallback — and delegate
spawns are skipped explicitly to avoid a flash before their AgentCard
registers.

The rich record (label, formatted result, error status) is sourced from the
activity store by tool-call id; a minimal record built from the raw render
props is used while the group is still catching up, so the card never
disappears once the tool resolves.

## Returns

`null`
