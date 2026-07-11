[**kaboo-react**](../../README.md)

***

# Function: AgentCard()

> **AgentCard**(`__namedParameters`): `Element`

Defined in: [components/AgentCard.tsx:50](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L50)

Card for a single agent run: title, status badge, task, chronological timeline
(text + tool rows), result/structured output, and a "View details" drill
button. Delegated sub-agents are interleaved at their tool-call position; with
`showChildren` the card renders its whole child tree inline.

## Parameters

### \_\_namedParameters

[`AgentCardProps`](../interfaces/AgentCardProps.md)

## Returns

`Element`

## Example

```tsx
import { AgentCard, useActivity } from "kaboo-react";

function FirstCard() {
  const { groups } = useActivity();
  const [id, group] = Object.entries(groups)[0] ?? [];
  return id ? <AgentCard groupId={id} group={group} /> : null;
}
```
