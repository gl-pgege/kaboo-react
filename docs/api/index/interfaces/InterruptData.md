[**@pgege/kaboo-react**](../../README.md)

***

# Interface: InterruptData

Defined in: [src/types.ts:99](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L99)

A single open interrupt from the AG-UI run, as delivered by CopilotKit.
Multiple can be open at once (e.g. parallel gates); each is resolved by `id`.

## Properties

### id

> **id**: `string`

Defined in: [src/types.ts:101](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L101)

Unique interrupt id, used to resolve this gate independently.

***

### name

> **name**: `string`

Defined in: [src/types.ts:103](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L103)

The interrupt's name (typically the originating tool name).

***

### reason

> **reason**: [`InterruptReason`](../type-aliases/InterruptReason.md)

Defined in: [src/types.ts:105](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L105)

Why the run paused, and what input it needs.
