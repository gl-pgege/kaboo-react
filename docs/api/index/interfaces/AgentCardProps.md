[**@pgege/kaboo-react**](../../README.md)

***

# Interface: AgentCardProps

Defined in: [src/components/AgentCard.tsx:13](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L13)

Props for [AgentCard](../functions/AgentCard.md).

## Properties

### actionStatus?

> `optional` **actionStatus?**: `string`

Defined in: [src/components/AgentCard.tsx:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L23)

Host-provided action status (e.g. `"complete"`) used to mark the card done.

***

### group

> **group**: [`StreamGroup`](StreamGroup.md)

Defined in: [src/components/AgentCard.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L17)

The activity group to render.

***

### groupId

> **groupId**: `string`

Defined in: [src/components/AgentCard.tsx:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L15)

Id of the group this card renders.

***

### input?

> `optional` **input?**: `string`

Defined in: [src/components/AgentCard.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L19)

Task/input text to show, overriding the group's own `task`.

***

### result?

> `optional` **result?**: `string`

Defined in: [src/components/AgentCard.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L21)

Raw tool result to render as the card's answer, when provided by the host.

***

### showChildren?

> `optional` **showChildren?**: `boolean`

Defined in: [src/components/AgentCard.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/AgentCard.tsx#L31)

When true, the card renders its `directChildren` inline as nested
[AgentCard](../functions/AgentCard.md)s (recursively). Used by the first-class swarm/graph inline
renderer to show the whole member tree without the drill navigation. Left
off (default) for the delegate path and the drill views, which surface
children through their own navigation.
