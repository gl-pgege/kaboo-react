[**@pgege/kaboo-react**](../../README.md)

***

# Interface: FormQuestion

Defined in: [src/types.ts:55](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L55)

A single multiple-choice question in a human-in-the-loop form interrupt. The
person picks one option (or several when `multiple`), and can always choose
Other to answer in their own words — the card adds that choice.

## Properties

### multiple?

> `optional` **multiple?**: `boolean`

Defined in: [src/types.ts:61](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L61)

Whether the person may choose several options.

***

### options

> **options**: `string`[]

Defined in: [src/types.ts:59](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L59)

The choices, two or more.

***

### question

> **question**: `string`

Defined in: [src/types.ts:57](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L57)

The prompt text shown to the user.

***

### ~~type?~~

> `optional` **type?**: `"text"` \| `"radio"` \| `"checkbox"`

Defined in: [src/types.ts:68](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L68)

Control type sent by kaboo-workflows before 0.27 (`checkbox` meant
multi-select). Read only when `multiple` is absent.

#### Deprecated

Use `multiple`.
