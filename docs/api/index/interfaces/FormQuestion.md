[**@pgege/kaboo-react**](../../README.md)

***

# Interface: FormQuestion

Defined in: [src/types.ts:54](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L54)

A single question in a human-in-the-loop form interrupt. `type` selects the
input control; `options` supplies the choices for `radio`/`checkbox`.

## Properties

### options?

> `optional` **options?**: `string`[]

Defined in: [src/types.ts:60](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L60)

Selectable choices for `radio`/`checkbox` questions.

***

### question

> **question**: `string`

Defined in: [src/types.ts:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L56)

The prompt text shown to the user.

***

### type

> **type**: `"text"` \| `"radio"` \| `"checkbox"`

Defined in: [src/types.ts:58](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L58)

Which input control to render for this question.
