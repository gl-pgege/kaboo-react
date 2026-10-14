[**@pgege/kaboo-react**](../../README.md)

***

# Interface: PermissionListProps

Defined in: [src/components/PermissionList.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/PermissionList.tsx#L21)

Props for [PermissionList](../functions/PermissionList.md).

## Properties

### emptyText?

> `optional` **emptyText?**: `string`

Defined in: [src/components/PermissionList.tsx:27](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/PermissionList.tsx#L27)

Text shown when there is nothing to list.

***

### grants

> **grants**: [`RememberedPermission`](RememberedPermission.md)[]

Defined in: [src/components/PermissionList.tsx:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/PermissionList.tsx#L23)

The permissions to show, in display order.

***

### onRevoke

> **onRevoke**: (`id`) => `void`

Defined in: [src/components/PermissionList.tsx:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/PermissionList.tsx#L25)

Called with a permission's id when the person revokes it.

#### Parameters

##### id

`string`

#### Returns

`void`
