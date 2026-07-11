[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ActivityState

Defined in: [types.ts:187](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L187)

The full activity snapshot for a conversation: every [StreamGroup](StreamGroup.md)
keyed by group id. This is what [useActivity](../functions/useActivity.md) exposes.

## Properties

### groups

> **groups**: `Record`\<`string`, [`StreamGroup`](StreamGroup.md)\>

Defined in: [types.ts:189](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L189)

All activity groups for the current thread, keyed by group id.
