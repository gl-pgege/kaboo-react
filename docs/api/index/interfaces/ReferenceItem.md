[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ReferenceItem\<T\>

Defined in: src/references/types.ts:37

One selectable item surfaced by a [ReferenceProvider](ReferenceProvider.md) in the `@` menu.
`data` is provider-defined and threaded back to [ReferenceProvider.toReference](ReferenceProvider.md#toreference).

## Type Parameters

### T

`T` = `unknown`

## Properties

### data?

> `optional` **data?**: `T`

Defined in: src/references/types.ts:45

Provider-defined payload passed to [ReferenceProvider.toReference](ReferenceProvider.md#toreference).

***

### description?

> `optional` **description?**: `string`

Defined in: src/references/types.ts:43

Optional secondary line (e.g. a path, table schema, owner).

***

### id

> **id**: `string`

Defined in: src/references/types.ts:39

Stable id for the underlying entity (provider scope).

***

### label

> **label**: `string`

Defined in: src/references/types.ts:41

Human label shown in the menu and used as the default mention chip text.
