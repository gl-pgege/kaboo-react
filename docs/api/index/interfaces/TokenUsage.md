[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TokenUsage

Defined in: [src/types.ts:134](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L134)

LLM token usage totals, as accumulated by kaboo-workflows from each agent
completion. Appears on a [StreamGroup](StreamGroup.md) (per-agent totals) and in
[ActivityState.usageByRun](ActivityState.md#usagebyrun) (per-run rollup). Counts accumulate across
repeat completions (interrupt resumes, delegate re-entry).

## Properties

### cacheReadInputTokens?

> `optional` **cacheReadInputTokens?**: `number`

Defined in: [src/types.ts:146](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L146)

Input tokens served from the provider's prompt cache (billed at a steep
discount). Subset of [TokenUsage.inputTokens](#inputtokens). Absent on streams
from services that predate cache accounting.

***

### cacheWriteInputTokens?

> `optional` **cacheWriteInputTokens?**: `number`

Defined in: [src/types.ts:148](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L148)

Input tokens written to the provider's prompt cache. Absent on older streams.

***

### cost?

> `optional` **cost?**: `number`

Defined in: [src/types.ts:154](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L154)

Accumulated dollar cost of the LLM calls, as reported by the provider's
usage accounting. Absent on older streams or providers without per-call
cost reporting.

***

### inputTokens

> **inputTokens**: `number`

Defined in: [src/types.ts:136](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L136)

Prompt/input tokens consumed.

***

### outputTokens

> **outputTokens**: `number`

Defined in: [src/types.ts:138](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L138)

Completion/output tokens produced.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [src/types.ts:140](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L140)

Total tokens (as reported by the model provider).
