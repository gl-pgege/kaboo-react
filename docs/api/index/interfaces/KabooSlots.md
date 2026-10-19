[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooSlots

Defined in: [src/context/KabooSlots.tsx:49](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L49)

App-supplied render slots for the chat surfaces. kaboo-react renders nothing
in these positions by default — each slot is pure mechanism, letting hosts
attach their own policy (end-of-turn artifact cards, timestamps, run-start
indicators) without the library forcing an opinion.

Provide them once on [KabooProvider](../functions/KabooProvider.md) (or per-view on
`KabooMessageView`, which takes precedence).

## Properties

### assistantMessageFooter?

> `optional` **assistantMessageFooter?**: (`message`) => `ReactNode`

Defined in: [src/context/KabooSlots.tsx:60](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L60)

Rendered under each assistant message (e.g. a timestamp row).

#### Parameters

##### message

[`SlotMessage`](SlotMessage.md)

#### Returns

`ReactNode`

***

### runStartIndicator?

> `optional` **runStartIndicator?**: `ComponentType`

Defined in: [src/context/KabooSlots.tsx:70](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L70)

Rendered while a run is in flight until the current turn's first activity
group appears (a swarm/graph member or a delegated agent, active or
finished), covering the gap right after send where the UI otherwise looks
idle. Groups from earlier turns don't count. The current turn is the one
the latest user message started, read from its `kaboo.message_meta`
event; without that event the indicator hides while any group is active.
Defaults to CopilotKit's streaming cursor.

***

### turnFooter?

> `optional` **turnFooter?**: (`ctx`) => `ReactNode`

Defined in: [src/context/KabooSlots.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L56)

Rendered once per completed turn, after the turn's final assistant
message, with every activity group that turn produced. The natural home
for end-of-turn artifact cards (e.g. "here's the dashboard this turn
built"), derived from `structuredOutput` on the turn's groups.

#### Parameters

##### ctx

[`TurnFooterContext`](TurnFooterContext.md)

#### Returns

`ReactNode`

***

### userMessageFooter?

> `optional` **userMessageFooter?**: (`message`) => `ReactNode`

Defined in: [src/context/KabooSlots.tsx:58](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L58)

Rendered under each user message bubble (e.g. a timestamp row).

#### Parameters

##### message

[`SlotMessage`](SlotMessage.md)

#### Returns

`ReactNode`
