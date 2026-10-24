[**@pgege/kaboo-react**](../../README.md)

***

# Interface: StreamGroup

Defined in: [src/types.ts:223](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L223)

One node of kaboo's hierarchical activity tree: a single agent run and its
streamed text, tool calls, timeline, structured output, and (optional)
open interrupt. Groups nest via [StreamGroup.parentGroup](#parentgroup) to form the
drill-down hierarchy.

## Properties

### agentName

> **agentName**: `string`

Defined in: [src/types.ts:227](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L227)

The agent's machine name (used to correlate inline cards).

***

### inlineChatOwner?

> `optional` **inlineChatOwner?**: `boolean`

Defined in: [src/types.ts:272](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L272)

True for a plain-agent entry group: its text and tool calls are already
rendered inline in the chat by the host (CopilotKit), so this group exists
only to enrich those tool rows (labels, formatted results, error status)
and must never be drawn as its own card.

***

### interrupt?

> `optional` **interrupt?**: [`InterruptData`](InterruptData.md)

Defined in: [src/types.ts:285](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L285)

The open interrupt for this group, when it is paused for input.

***

### isChatReply?

> `optional` **isChatReply?**: `boolean`

Defined in: [src/types.ts:265](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L265)

True when this agent's streamed text IS the chat reply (the swarm/graph
`chat_output`, or a delegate manager). Inline cards suppress only this
group's text so the answer isn't duplicated between the card and the bubble.

***

### outputSchemaName?

> `optional` **outputSchemaName?**: `string`

Defined in: [src/types.ts:289](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L289)

Name of the schema for [StreamGroup.structuredOutput](#structuredoutput), selecting a renderer.

***

### parentGroup

> **parentGroup**: `string` \| `null`

Defined in: [src/types.ts:229](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L229)

Parent group id, or `null` for a top-level group.

***

### runId?

> `optional` **runId?**: `string` \| `null`

Defined in: [src/types.ts:241](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L241)

The AG-UI `runId` of the turn that produced this group. `null`/absent for
older streams. Note: an interrupt/resume changes the `runId` mid-turn, so
prefer [StreamGroup.turnId](#turnid) for turn scoping.

***

### runIds?

> `optional` **runIds?**: `string`[] \| `null`

Defined in: [src/types.ts:247](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L247)

Every AG-UI run that streamed into this group, in order: the run that
opened it, then each run that resumed the turn after an approval or a
question (kaboo-workflows 0.28.2 and later; absent for older streams).

***

### status

> **status**: `"error"` \| `"active"` \| `"completed"` \| `"interrupted"` \| `"stopped"`

Defined in: [src/types.ts:279](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L279)

Lifecycle state of the group's run. `"stopped"` is client-derived: when a
run ends (`RUN_FINISHED`/`RUN_ERROR`) with the group still `"active"`, the
activity provider settles it to `"stopped"` so no card spins forever after
an abort — workflows themselves never emit it.

***

### structuredOutput?

> `optional` **structuredOutput?**: `Record`\<`string`, `unknown`\>

Defined in: [src/types.ts:287](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L287)

Structured (schema-shaped) output emitted by the agent, if any.

***

### task?

> `optional` **task?**: `string` \| `null`

Defined in: [src/types.ts:259](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L259)

The task this agent was handed (its latest human/handoff message), shown at
the top of the card so you can see what each agent was asked to do.

***

### timeline

> **timeline**: [`TimelineEntry`](../type-aliases/TimelineEntry.md)[]

Defined in: [src/types.ts:283](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L283)

Interleaved text/tool entries in chronological order.

***

### title

> **title**: `string`

Defined in: [src/types.ts:225](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L225)

Display title for the group's card.

***

### toolCallId?

> `optional` **toolCallId?**: `string` \| `null`

Defined in: [src/types.ts:235](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L235)

The delegating tool-call id (AG-UI `toolCallId`) that spawned this group.
Stable key for correlating an inline chat card with its activity group.
`null`/absent for the entry agent and non-delegated groups.

***

### tools

> **tools**: [`ToolCall`](ToolCall.md)[]

Defined in: [src/types.ts:281](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L281)

Every tool call made in this group, in call order.

***

### traceId?

> `optional` **traceId?**: `string` \| `null`

Defined in: [src/types.ts:299](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L299)

OpenTelemetry trace id (32-char hex) of the agent invocation that produced
this group, when the workflow service runs with telemetry enabled. The
correlation key for attaching feedback scores to the exact trace in an
observability backend (e.g. Langfuse). Absent when telemetry is off or the
stream predates it.

***

### turnId?

> `optional` **turnId?**: `string` \| `null`

Defined in: [src/types.ts:254](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L254)

The logical turn that produced this group — stable across an
interrupt/resume (server-stamped). All groups of one user turn share it, so
the UI can bind them to that turn's single chat reply without fragmenting
on `runId`. `null`/absent for older streams.

***

### usage?

> `optional` **usage?**: [`TokenUsage`](TokenUsage.md)

Defined in: [src/types.ts:291](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L291)

Accumulated LLM token usage for this agent, once it has completed at least once.
