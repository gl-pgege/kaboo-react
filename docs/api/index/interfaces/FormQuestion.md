[**@pgege/kaboo-react**](../../README.md)

***

# Interface: FormQuestion

Defined in: [src/types.ts:47](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L47)

A single multiple-choice question in a human-in-the-loop form interrupt. The
person picks one option (or several when `multiple`), and can always choose
Other to answer in their own words — the card adds that choice.

## Properties

### multiple?

> `optional` **multiple?**: `boolean`

Defined in: [src/types.ts:53](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L53)

Whether the person may choose several options.

***

### options

> **options**: `string`[]

Defined in: [src/types.ts:51](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L51)

The choices, two or more.

***

### question

> **question**: `string`

Defined in: [src/types.ts:49](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L49)

The prompt text shown to the user.
