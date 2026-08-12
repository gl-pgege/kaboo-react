[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooSlots

Defined in: src/context/KabooSlots.tsx:37

App-supplied render slots for the chat surfaces. kaboo-react renders nothing
in these positions by default — each slot is pure mechanism, letting hosts
attach their own policy (end-of-turn artifact cards, timestamps, run-start
indicators) without the library forcing an opinion.

Provide them once on [KabooProvider](../functions/KabooProvider.md) (or per-view on
`KabooMessageView`, which takes precedence).

## Properties

### assistantMessageFooter?

> `optional` **assistantMessageFooter?**: (`message`) => `ReactNode`

Defined in: src/context/KabooSlots.tsx:48

Rendered under each assistant message (e.g. a timestamp row).

#### Parameters

##### message

[`SlotMessage`](SlotMessage.md)

#### Returns

`ReactNode`

***

### runStartIndicator?

> `optional` **runStartIndicator?**: `ComponentType`

Defined in: src/context/KabooSlots.tsx:54

Rendered while a run is in flight but no activity has streamed yet (the
gap right after send where the UI otherwise looks idle). Defaults to
CopilotKit's streaming cursor.

***

### turnFooter?

> `optional` **turnFooter?**: (`ctx`) => `ReactNode`

Defined in: src/context/KabooSlots.tsx:44

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

Defined in: src/context/KabooSlots.tsx:46

Rendered under each user message bubble (e.g. a timestamp row).

#### Parameters

##### message

[`SlotMessage`](SlotMessage.md)

#### Returns

`ReactNode`
