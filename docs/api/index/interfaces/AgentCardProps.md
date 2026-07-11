[**kaboo-react**](../../README.md)

***

# Interface: AgentCardProps

Defined in: [components/AgentCard.tsx:12](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L12)

Props for [AgentCard](../functions/AgentCard.md).

## Properties

### actionStatus?

> `optional` **actionStatus?**: `string`

Defined in: [components/AgentCard.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L22)

Host-provided action status (e.g. `"complete"`) used to mark the card done.

***

### group

> **group**: [`StreamGroup`](StreamGroup.md)

Defined in: [components/AgentCard.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L16)

The activity group to render.

***

### groupId

> **groupId**: `string`

Defined in: [components/AgentCard.tsx:14](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L14)

Id of the group this card renders.

***

### input?

> `optional` **input?**: `string`

Defined in: [components/AgentCard.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L18)

Task/input text to show, overriding the group's own `task`.

***

### result?

> `optional` **result?**: `string`

Defined in: [components/AgentCard.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L20)

Raw tool result to render as the card's answer, when provided by the host.

***

### showChildren?

> `optional` **showChildren?**: `boolean`

Defined in: [components/AgentCard.tsx:30](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/AgentCard.tsx#L30)

When true, the card renders its `directChildren` inline as nested
[AgentCard](../functions/AgentCard.md)s (recursively). Used by the first-class swarm/graph inline
renderer to show the whole member tree without the drill navigation. Left
off (default) for the delegate path and the drill views, which surface
children through their own navigation.
