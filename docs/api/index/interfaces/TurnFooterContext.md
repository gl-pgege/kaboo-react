[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TurnFooterContext

Defined in: [src/context/KabooSlots.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L19)

Context handed to a [KabooSlots.turnFooter](KabooSlots.md#turnfooter) renderer.

## Properties

### groups

> **groups**: [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: [src/context/KabooSlots.tsx:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L25)

Every activity group the turn produced (roots and nested), in stream order.

***

### message

> **message**: [`SlotMessage`](SlotMessage.md)

Defined in: [src/context/KabooSlots.tsx:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L23)

The anchor message itself.

***

### messageId

> **messageId**: `string`

Defined in: [src/context/KabooSlots.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L21)

Id of the turn's final assistant message (the footer's anchor).

***

### traceId?

> `optional` **traceId?**: `string`

Defined in: [src/context/KabooSlots.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L31)

OpenTelemetry trace id of the turn's root run, when the workflow service
ran with telemetry enabled. Hosts use this to attach feedback scores to
the exact trace. Absent when telemetry is off.
