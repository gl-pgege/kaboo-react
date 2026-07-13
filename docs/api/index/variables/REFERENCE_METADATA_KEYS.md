[**@pgege/kaboo-react**](../../README.md)

***

# Variable: REFERENCE\_METADATA\_KEYS

> `const` **REFERENCE\_METADATA\_KEYS**: `object`

Defined in: [src/references/types.ts:9](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L9)

Wire keys shared with kaboo-workflows. A file attachment carries its id/kind/
name in the CopilotKit `InputContent` part `metadata` under these keys; the
Python side reads the same keys back out. Kept snake_case so both stacks
agree without a translation layer.

## Type Declaration

### id

> `readonly` **id**: `"kaboo_id"` = `"kaboo_id"`

Metadata key carrying the reference id.

### kind

> `readonly` **kind**: `"kaboo_kind"` = `"kaboo_kind"`

Metadata key carrying the reference kind.

### name

> `readonly` **name**: `"kaboo_name"` = `"kaboo_name"`

Metadata key carrying the reference display name.
