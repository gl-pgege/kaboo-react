[**@pgege/kaboo-react**](../../README.md)

***

# Interface: SlotMessage

Defined in: src/context/KabooSlots.tsx:8

A chat message as the slot renderers receive it (CopilotKit's message shape,
loosely typed so hosts can read whatever fields their runtime provides).

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### content?

> `optional` **content?**: `unknown`

Defined in: src/context/KabooSlots.tsx:14

The message content (string or content parts, per the runtime).

***

### id?

> `optional` **id?**: `string`

Defined in: src/context/KabooSlots.tsx:10

The message id.

***

### role?

> `optional` **role?**: `string`

Defined in: src/context/KabooSlots.tsx:12

The message role (`"user"`, `"assistant"`, ...).
