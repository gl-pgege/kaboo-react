[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ActivityState

Defined in: [src/types.ts:311](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L311)

The full activity snapshot for a conversation: every [StreamGroup](StreamGroup.md)
keyed by group id. This is what [useActivity](../functions/useActivity.md) exposes.

## Properties

### errorByRun?

> `optional` **errorByRun?**: `Record`\<`string`, [`RunError`](RunError.md)\>

Defined in: [src/types.ts:337](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L337)

Why each failed run failed, keyed by AG-UI `runId`: the run's `RUN_ERROR`
live, or the `kaboo.run_error` event kaboo-runtime puts in its place on
replay.

***

### groups

> **groups**: `Record`\<`string`, [`StreamGroup`](StreamGroup.md)\>

Defined in: [src/types.ts:313](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L313)

All activity groups for the current thread, keyed by group id.

***

### toolOutcomes?

> `optional` **toolOutcomes?**: `Record`\<`string`, [`ToolOutcome`](ToolOutcome.md)\>

Defined in: [src/types.ts:331](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L331)

How each top-level tool call ended, keyed by tool-call id: the `status`,
`error` and `fix` the workflow service puts in the metadata of its
`TOOL_CALL_RESULT`. Sub-agent calls carry the same on their [ToolCall](ToolCall.md).

***

### traceByRun?

> `optional` **traceByRun?**: `Record`\<`string`, `string`\>

Defined in: [src/types.ts:325](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L325)

Per-run OpenTelemetry trace id (the run's root trace), keyed by AG-UI
`runId`. Present only when the workflow service runs with telemetry
enabled. Use it to attach run-level feedback scores to the exact trace.

***

### usageByRun?

> `optional` **usageByRun?**: `Record`\<`string`, [`TokenUsage`](TokenUsage.md)\>

Defined in: [src/types.ts:319](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L319)

Per-run token usage rollup, keyed by AG-UI `runId`. Accumulated
independently of groups so run totals include every agent completion —
even groupless ones. Absent on streams from older services.
