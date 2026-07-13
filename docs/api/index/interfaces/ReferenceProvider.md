[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ReferenceProvider\<T\>

Defined in: [src/references/types.ts:97](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L97)

A pluggable entry in the `@` reference menu. File upload ships as a built-in
provider (see `uploadProvider`); apps register their own for entities/actions
(tables, dashboards, tickets, …).

A provider is either *searchable* (supplies [search](#search) so its items list
live in the menu) or *action-only* (omits [search](#search); selecting its group
row runs [onSelect](#onselect), e.g. opening a file picker).

## Extended by

- [`UploadReferenceProvider`](UploadReferenceProvider.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### icon?

> `optional` **icon?**: `ReactNode`

Defined in: [src/references/types.ts:103](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L103)

Optional icon rendered beside the group heading.

***

### id

> **id**: `string`

Defined in: [src/references/types.ts:99](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L99)

Stable provider id, e.g. `"upload" | "table" | "dashboard"`.

***

### label

> **label**: `string`

Defined in: [src/references/types.ts:101](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L101)

Group heading shown in the `@` menu.

***

### onSelect?

> `optional` **onSelect?**: (`item`) => `void` \| `Promise`\<`void`\>

Defined in: [src/references/types.ts:115](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L115)

Side effect when an item (or the action-only group row) is chosen, e.g.
opening a file dialog or running an action. Called before [toReference](#toreference).

#### Parameters

##### item

[`ReferenceItem`](ReferenceItem.md)\<`T`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### renderItem?

> `optional` **renderItem?**: (`item`) => `ReactNode`

Defined in: [src/references/types.ts:110](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L110)

Custom row renderer; falls back to `label` + `description`.

#### Parameters

##### item

[`ReferenceItem`](ReferenceItem.md)\<`T`\>

#### Returns

`ReactNode`

***

### search?

> `optional` **search?**: (`query`) => [`ReferenceItem`](ReferenceItem.md)\<`T`\>[] \| `Promise`\<[`ReferenceItem`](ReferenceItem.md)\<`T`\>[]\>

Defined in: [src/references/types.ts:108](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L108)

Return the items to list for the current query. Omit for an action-only
provider (its group row triggers [onSelect](#onselect) directly).

#### Parameters

##### query

`string`

#### Returns

[`ReferenceItem`](ReferenceItem.md)\<`T`\>[] \| `Promise`\<[`ReferenceItem`](ReferenceItem.md)\<`T`\>[]\>

***

### toReference?

> `optional` **toReference?**: (`item`) => [`PendingReference`](../type-aliases/PendingReference.md)

Defined in: [src/references/types.ts:120](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L120)

How a chosen item serializes onto the message. Omit for pure actions that
produce their reference asynchronously (e.g. upload, via its own callback).

#### Parameters

##### item

[`ReferenceItem`](ReferenceItem.md)\<`T`\>

#### Returns

[`PendingReference`](../type-aliases/PendingReference.md)
