[**@pgege/kaboo-react**](../../README.md)

***

# Interface: AgentCardProps

Defined in: [src/components/AgentCard.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L16)

Props for [AgentCard](../functions/AgentCard.md).

## Properties

### actionStatus?

> `optional` **actionStatus?**: `string`

Defined in: [src/components/AgentCard.tsx:26](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L26)

Host-provided action status (e.g. `"complete"`) used to mark the card done.

***

### group

> **group**: [`StreamGroup`](StreamGroup.md)

Defined in: [src/components/AgentCard.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L20)

The activity group to render.

***

### groupId

> **groupId**: `string`

Defined in: [src/components/AgentCard.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L18)

Id of the group this card renders.

***

### input?

> `optional` **input?**: `string`

Defined in: [src/components/AgentCard.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L22)

Task/input text to show, overriding the group's own `task`.

***

### result?

> `optional` **result?**: `string`

Defined in: [src/components/AgentCard.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L24)

Raw tool result to render as the card's answer, when provided by the host.

***

### showChildren?

> `optional` **showChildren?**: `boolean`

Defined in: [src/components/AgentCard.tsx:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L34)

When true, the card renders its `directChildren` inline as nested
[AgentCard](../functions/AgentCard.md)s (recursively). Used by the first-class swarm/graph inline
renderer to show the whole member tree without the drill navigation. Left
off (default) for the delegate path and the drill views, which surface
children through their own navigation.
