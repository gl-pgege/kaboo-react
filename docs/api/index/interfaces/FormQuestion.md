[**kaboo-react**](../../README.md)

***

# Interface: FormQuestion

Defined in: [types.ts:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L43)

A single question in a human-in-the-loop form interrupt. `type` selects the
input control; `options` supplies the choices for `radio`/`checkbox`.

## Properties

### options?

> `optional` **options?**: `string`[]

Defined in: [types.ts:49](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L49)

Selectable choices for `radio`/`checkbox` questions.

***

### question

> **question**: `string`

Defined in: [types.ts:45](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L45)

The prompt text shown to the user.

***

### type

> **type**: `"text"` \| `"radio"` \| `"checkbox"`

Defined in: [types.ts:47](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L47)

Which input control to render for this question.
