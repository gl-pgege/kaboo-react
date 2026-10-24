[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ActivityState

Defined in: [src/types.ts:306](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L306)

The full activity snapshot for a conversation: every [StreamGroup](StreamGroup.md)
keyed by group id. This is what [useActivity](../functions/useActivity.md) exposes.

## Properties

### groups

> **groups**: `Record`\<`string`, [`StreamGroup`](StreamGroup.md)\>

Defined in: [src/types.ts:308](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L308)

All activity groups for the current thread, keyed by group id.

***

### traceByRun?

> `optional` **traceByRun?**: `Record`\<`string`, `string`\>

Defined in: [src/types.ts:320](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L320)

Per-run OpenTelemetry trace id (the run's root trace), keyed by AG-UI
`runId`. Present only when the workflow service runs with telemetry
enabled. Use it to attach run-level feedback scores to the exact trace.

***

### usageByRun?

> `optional` **usageByRun?**: `Record`\<`string`, [`TokenUsage`](TokenUsage.md)\>

Defined in: [src/types.ts:314](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L314)

Per-run token usage rollup, keyed by AG-UI `runId`. Accumulated
independently of groups so run totals include every agent completion —
even groupless ones. Absent on streams from older services.
