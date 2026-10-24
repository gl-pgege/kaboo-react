[**@pgege/kaboo-react**](../../README.md)

***

# Interface: InterruptData

Defined in: [src/types.ts:153](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L153)

A single open interrupt from the AG-UI run, as delivered by CopilotKit.
Multiple can be open at once (e.g. parallel gates); each is resolved by `id`.

## Properties

### id

> **id**: `string`

Defined in: [src/types.ts:155](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L155)

Unique interrupt id, used to resolve this gate independently.

***

### name

> **name**: `string`

Defined in: [src/types.ts:157](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L157)

The interrupt's name (typically the originating tool name).

***

### reason

> **reason**: [`CustomRequestReason`](CustomRequestReason.md) \| [`InterruptReason`](../type-aliases/InterruptReason.md)

Defined in: [src/types.ts:159](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L159)

Why the run paused, and what input it needs.
