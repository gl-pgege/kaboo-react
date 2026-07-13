[**@pgege/kaboo-react**](../../README.md)

***

# Interface: FormReason

Defined in: [src/types.ts:71](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L71)

A form interrupt: the agent is asking the user one or more questions and
waiting for the answers before it continues.

## Properties

### questions

> **questions**: [`FormQuestion`](FormQuestion.md)[]

Defined in: [src/types.ts:75](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L75)

The questions to present, rendered in order.

***

### type

> **type**: `"form"`

Defined in: [src/types.ts:73](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L73)

Discriminator marking this as a form prompt.
