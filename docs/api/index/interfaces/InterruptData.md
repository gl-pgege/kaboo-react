[**@pgege/kaboo-react**](../../README.md)

***

# Interface: InterruptData

Defined in: [src/types.ts:88](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L88)

A single open interrupt from the AG-UI run, as delivered by CopilotKit.
Multiple can be open at once (e.g. parallel gates); each is resolved by `id`.

## Properties

### id

> **id**: `string`

Defined in: [src/types.ts:90](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L90)

Unique interrupt id, used to resolve this gate independently.

***

### name

> **name**: `string`

Defined in: [src/types.ts:92](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L92)

The interrupt's name (typically the originating tool name).

***

### reason

> **reason**: [`InterruptReason`](../type-aliases/InterruptReason.md)

Defined in: [src/types.ts:94](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L94)

Why the run paused, and what input it needs.
