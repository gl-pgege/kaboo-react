[**@pgege/kaboo-react**](../../README.md)

***

# Interface: SerializedObjectReference

Defined in: [src/references/serialize.ts:66](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L66)

The serialized shape of an object reference inside `state.kaboo_references`.

## Properties

### id

> **id**: `string`

Defined in: [src/references/serialize.ts:70](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L70)

Stable reference id, shared with the backend manifest.

***

### kind

> **kind**: `string`

Defined in: [src/references/serialize.ts:68](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L68)

Reference kind (e.g. `"table"`), resolved by the app's MCP tool.

***

### meta?

> `optional` **meta?**: `Record`\<`string`, `unknown`\>

Defined in: [src/references/serialize.ts:74](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L74)

Arbitrary extra context threaded through to the resolver.

***

### name

> **name**: `string`

Defined in: [src/references/serialize.ts:72](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L72)

Human-readable label.
