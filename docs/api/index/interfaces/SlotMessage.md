[**@pgege/kaboo-react**](../../README.md)

***

# Interface: SlotMessage

Defined in: [src/context/KabooSlots.tsx:8](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L8)

A chat message as the slot renderers receive it (CopilotKit's message shape,
loosely typed so hosts can read whatever fields their runtime provides).

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### content?

> `optional` **content?**: `unknown`

Defined in: [src/context/KabooSlots.tsx:14](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L14)

The message content (string or content parts, per the runtime).

***

### id?

> `optional` **id?**: `string`

Defined in: [src/context/KabooSlots.tsx:10](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L10)

The message id.

***

### role?

> `optional` **role?**: `string`

Defined in: [src/context/KabooSlots.tsx:12](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooSlots.tsx#L12)

The message role (`"user"`, `"assistant"`, ...).
