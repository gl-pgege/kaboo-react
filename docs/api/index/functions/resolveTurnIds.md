[**@pgege/kaboo-react**](../../README.md)

***

# Function: resolveTurnIds()

> **resolveTurnIds**(`groups`, `traceByRun?`): `object`

Defined in: [src/feedback/useTurnFeedback.ts:55](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L55)

Resolve the identifying ids for a turn from the activity groups it produced.
The run-level trace (`traceByRun`) wins over any group's own `traceId`
because nested agents may complete under their own invocation traces.

## Parameters

### groups

[`GroupEntry`](../type-aliases/GroupEntry.md)[]

### traceByRun?

`Record`\<`string`, `string`\>

## Returns

### runId?

> `optional` **runId?**: `string`

AG-UI run id of the turn's first run, when known.

### traceId?

> `optional` **traceId?**: `string`

OTel trace id of the turn's root run, when telemetry was enabled.

### turnId?

> `optional` **turnId?**: `string`

kaboo turn id (stable across interrupt/resume), when known.
