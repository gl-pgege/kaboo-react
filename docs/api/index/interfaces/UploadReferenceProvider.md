[**@pgege/kaboo-react**](../../README.md)

***

# Interface: UploadReferenceProvider

Defined in: [src/references/uploadProvider.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L31)

A [ReferenceProvider](ReferenceProvider.md) carrying its resolved upload config for the composer.

## Extends

- [`ReferenceProvider`](ReferenceProvider.md)

## Properties

### \_\_kabooUpload

> **\_\_kabooUpload**: `Required`\<`Pick`\<[`UploadProviderConfig`](UploadProviderConfig.md), `"kind"` \| `"maxSize"`\>\> & `Pick`\<[`UploadProviderConfig`](UploadProviderConfig.md), `"accept"` \| `"onUpload"`\>

Defined in: [src/references/uploadProvider.tsx:33](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/uploadProvider.tsx#L33)

Resolved upload config the composer reads to drive the file picker.

***

### icon?

> `optional` **icon?**: `ReactNode`

Defined in: [src/references/types.ts:103](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L103)

Optional icon rendered beside the group heading.

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`icon`](ReferenceProvider.md#icon)

***

### id

> **id**: `string`

Defined in: [src/references/types.ts:99](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L99)

Stable provider id, e.g. `"upload" | "table" | "dashboard"`.

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`id`](ReferenceProvider.md#id)

***

### label

> **label**: `string`

Defined in: [src/references/types.ts:101](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L101)

Group heading shown in the `@` menu.

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`label`](ReferenceProvider.md#label)

***

### onSelect?

> `optional` **onSelect?**: (`item`) => `void` \| `Promise`\<`void`\>

Defined in: [src/references/types.ts:115](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L115)

Side effect when an item (or the action-only group row) is chosen, e.g.
opening a file dialog or running an action. Called before [toReference](ReferenceProvider.md#toreference).

#### Parameters

##### item

[`ReferenceItem`](ReferenceItem.md)\<`unknown`\>

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`onSelect`](ReferenceProvider.md#onselect)

***

### renderItem?

> `optional` **renderItem?**: (`item`) => `ReactNode`

Defined in: [src/references/types.ts:110](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L110)

Custom row renderer; falls back to `label` + `description`.

#### Parameters

##### item

[`ReferenceItem`](ReferenceItem.md)\<`unknown`\>

#### Returns

`ReactNode`

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`renderItem`](ReferenceProvider.md#renderitem)

***

### search?

> `optional` **search?**: (`query`) => [`ReferenceItem`](ReferenceItem.md)\<`unknown`\>[] \| `Promise`\<[`ReferenceItem`](ReferenceItem.md)\<`unknown`\>[]\>

Defined in: [src/references/types.ts:108](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L108)

Return the items to list for the current query. Omit for an action-only
provider (its group row triggers [onSelect](ReferenceProvider.md#onselect) directly).

#### Parameters

##### query

`string`

#### Returns

[`ReferenceItem`](ReferenceItem.md)\<`unknown`\>[] \| `Promise`\<[`ReferenceItem`](ReferenceItem.md)\<`unknown`\>[]\>

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`search`](ReferenceProvider.md#search)

***

### toReference?

> `optional` **toReference?**: (`item`) => [`PendingReference`](../type-aliases/PendingReference.md)

Defined in: [src/references/types.ts:120](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L120)

How a chosen item serializes onto the message. Omit for pure actions that
produce their reference asynchronously (e.g. upload, via its own callback).

#### Parameters

##### item

[`ReferenceItem`](ReferenceItem.md)\<`unknown`\>

#### Returns

[`PendingReference`](../type-aliases/PendingReference.md)

#### Inherited from

[`ReferenceProvider`](ReferenceProvider.md).[`toReference`](ReferenceProvider.md#toreference)
