[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ActivityState

Defined in: [src/types.ts:223](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L223)

The full activity snapshot for a conversation: every [StreamGroup](StreamGroup.md)
keyed by group id. This is what [useActivity](../functions/useActivity.md) exposes.

## Properties

### groups

> **groups**: `Record`\<`string`, [`StreamGroup`](StreamGroup.md)\>

Defined in: [src/types.ts:225](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L225)

All activity groups for the current thread, keyed by group id.

***

### usageByRun?

> `optional` **usageByRun?**: `Record`\<`string`, [`TokenUsage`](TokenUsage.md)\>

Defined in: [src/types.ts:231](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L231)

Per-run token usage rollup, keyed by AG-UI `runId`. Accumulated
independently of groups so run totals include every agent completion —
even groupless ones. Absent on streams from older services.
