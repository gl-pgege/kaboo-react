[**@pgege/kaboo-react**](../../README.md)

***

# Interface: RememberedPermission

Defined in: src/components/PermissionList.tsx:7

A remembered approval, as a host lists it (kaboo-runtime's `ToolGrant`
matches this shape).

## Properties

### createdAt?

> `optional` **createdAt?**: `number`

Defined in: src/components/PermissionList.tsx:17

When it was granted, epoch milliseconds.

***

### id

> **id**: `string`

Defined in: src/components/PermissionList.tsx:9

Id used to revoke it.

***

### label

> **label**: `string`

Defined in: src/components/PermissionList.tsx:13

Human label for what it covers.

***

### threadId

> **threadId**: `string` \| `null`

Defined in: src/components/PermissionList.tsx:15

The conversation it applies to, or `null` for every conversation.

***

### tool

> **tool**: `string`

Defined in: src/components/PermissionList.tsx:11

The gated tool.
