[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TokenUsage

Defined in: [src/types.ts:209](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L209)

LLM token usage totals, as accumulated by kaboo-workflows from each agent
completion. Appears on a [StreamGroup](StreamGroup.md) (per-agent totals) and in
[ActivityState.usageByRun](ActivityState.md#usagebyrun) (per-run rollup). Counts accumulate across
repeat completions (interrupt resumes, delegate re-entry).

## Properties

### cacheReadInputTokens?

> `optional` **cacheReadInputTokens?**: `number`

Defined in: [src/types.ts:221](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L221)

Input tokens served from the provider's prompt cache (billed at a steep
discount), counted apart from [TokenUsage.inputTokens](#inputtokens). Absent on
streams from services that predate cache accounting.

***

### cacheWriteInputTokens?

> `optional` **cacheWriteInputTokens?**: `number`

Defined in: [src/types.ts:223](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L223)

Input tokens written to the provider's prompt cache. Absent on older streams.

***

### cost?

> `optional` **cost?**: `number`

Defined in: [src/types.ts:229](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L229)

Accumulated dollar cost of the LLM calls, as reported by the provider's
usage accounting. Absent on older streams or providers without per-call
cost reporting.

***

### inputTokens

> **inputTokens**: `number`

Defined in: [src/types.ts:211](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L211)

Prompt/input tokens consumed, not counting cache reads or writes.

***

### outputTokens

> **outputTokens**: `number`

Defined in: [src/types.ts:213](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L213)

Completion/output tokens produced.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [src/types.ts:215](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L215)

Total tokens (as reported by the model provider).
