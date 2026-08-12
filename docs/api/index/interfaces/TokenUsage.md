[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TokenUsage

Defined in: [src/types.ts:123](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L123)

LLM token usage totals, as accumulated by kaboo-workflows from each agent
completion. Appears on a [StreamGroup](StreamGroup.md) (per-agent totals) and in
[ActivityState.usageByRun](ActivityState.md#usagebyrun) (per-run rollup). Counts accumulate across
repeat completions (interrupt resumes, delegate re-entry).

## Properties

### cacheReadInputTokens?

> `optional` **cacheReadInputTokens?**: `number`

Defined in: [src/types.ts:135](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L135)

Input tokens served from the provider's prompt cache (billed at a steep
discount). Subset of [TokenUsage.inputTokens](#inputtokens). Absent on streams
from services that predate cache accounting.

***

### cacheWriteInputTokens?

> `optional` **cacheWriteInputTokens?**: `number`

Defined in: [src/types.ts:137](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L137)

Input tokens written to the provider's prompt cache. Absent on older streams.

***

### cost?

> `optional` **cost?**: `number`

Defined in: [src/types.ts:143](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L143)

Accumulated dollar cost of the LLM calls, as reported by the provider's
usage accounting. Absent on older streams or providers without per-call
cost reporting.

***

### inputTokens

> **inputTokens**: `number`

Defined in: [src/types.ts:125](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L125)

Prompt/input tokens consumed.

***

### outputTokens

> **outputTokens**: `number`

Defined in: [src/types.ts:127](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L127)

Completion/output tokens produced.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [src/types.ts:129](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L129)

Total tokens (as reported by the model provider).
