[**@pgege/kaboo-react**](../../README.md)

***

# Interface: PermissionListProps

Defined in: src/components/PermissionList.tsx:21

Props for [PermissionList](../functions/PermissionList.md).

## Properties

### emptyText?

> `optional` **emptyText?**: `string`

Defined in: src/components/PermissionList.tsx:27

Text shown when there is nothing to list.

***

### grants

> **grants**: [`RememberedPermission`](RememberedPermission.md)[]

Defined in: src/components/PermissionList.tsx:23

The permissions to show, in display order.

***

### onRevoke

> **onRevoke**: (`id`) => `void`

Defined in: src/components/PermissionList.tsx:25

Called with a permission's id when the person revokes it.

#### Parameters

##### id

`string`

#### Returns

`void`
