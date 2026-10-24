[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TokenUsage

Defined in: [src/types.ts:194](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L194)

LLM token usage totals, as accumulated by kaboo-workflows from each agent
completion. Appears on a [StreamGroup](StreamGroup.md) (per-agent totals) and in
[ActivityState.usageByRun](ActivityState.md#usagebyrun) (per-run rollup). Counts accumulate across
repeat completions (interrupt resumes, delegate re-entry).

## Properties

### cacheReadInputTokens?

> `optional` **cacheReadInputTokens?**: `number`

Defined in: [src/types.ts:206](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L206)

Input tokens served from the provider's prompt cache (billed at a steep
discount), counted apart from [TokenUsage.inputTokens](#inputtokens). Absent on
streams from services that predate cache accounting.

***

### cacheWriteInputTokens?

> `optional` **cacheWriteInputTokens?**: `number`

Defined in: [src/types.ts:208](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L208)

Input tokens written to the provider's prompt cache. Absent on older streams.

***

### cost?

> `optional` **cost?**: `number`

Defined in: [src/types.ts:214](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L214)

Accumulated dollar cost of the LLM calls, as reported by the provider's
usage accounting. Absent on older streams or providers without per-call
cost reporting.

***

### inputTokens

> **inputTokens**: `number`

Defined in: [src/types.ts:196](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L196)

Prompt/input tokens consumed, not counting cache reads or writes.

***

### outputTokens

> **outputTokens**: `number`

Defined in: [src/types.ts:198](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L198)

Completion/output tokens produced.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [src/types.ts:200](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L200)

Total tokens (as reported by the model provider).
