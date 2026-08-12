[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TurnFooterContext

Defined in: src/context/KabooSlots.tsx:19

Context handed to a [KabooSlots.turnFooter](KabooSlots.md#turnfooter) renderer.

## Properties

### groups

> **groups**: [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: src/context/KabooSlots.tsx:25

Every activity group the turn produced (roots and nested), in stream order.

***

### message

> **message**: [`SlotMessage`](SlotMessage.md)

Defined in: src/context/KabooSlots.tsx:23

The anchor message itself.

***

### messageId

> **messageId**: `string`

Defined in: src/context/KabooSlots.tsx:21

Id of the turn's final assistant message (the footer's anchor).
