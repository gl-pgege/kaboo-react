[**@pgege/kaboo-react**](../../README.md)

***

# Interface: StreamGroup

Defined in: [src/types.ts:152](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L152)

One node of kaboo's hierarchical activity tree: a single agent run and its
streamed text, tool calls, timeline, structured output, and (optional)
open interrupt. Groups nest via [StreamGroup.parentGroup](#parentgroup) to form the
drill-down hierarchy.

## Properties

### agentName

> **agentName**: `string`

Defined in: [src/types.ts:156](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L156)

The agent's machine name (used to correlate inline cards).

***

### inlineChatOwner?

> `optional` **inlineChatOwner?**: `boolean`

Defined in: [src/types.ts:195](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L195)

True for a plain-agent entry group: its text and tool calls are already
rendered inline in the chat by the host (CopilotKit), so this group exists
only to enrich those tool rows (labels, formatted results, error status)
and must never be drawn as its own card.

***

### interrupt?

> `optional` **interrupt?**: [`InterruptData`](InterruptData.md)

Defined in: [src/types.ts:210](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L210)

The open interrupt for this group, when it is paused for input.

***

### isChatReply?

> `optional` **isChatReply?**: `boolean`

Defined in: [src/types.ts:188](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L188)

True when this agent's streamed text IS the chat reply (the swarm/graph
`chat_output`, or a delegate manager). Inline cards suppress only this
group's text so the answer isn't duplicated between the card and the bubble.

***

### outputSchemaName?

> `optional` **outputSchemaName?**: `string`

Defined in: [src/types.ts:214](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L214)

Name of the schema for [StreamGroup.structuredOutput](#structuredoutput), selecting a renderer.

***

### parentGroup

> **parentGroup**: `string` \| `null`

Defined in: [src/types.ts:158](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L158)

Parent group id, or `null` for a top-level group.

***

### runId?

> `optional` **runId?**: `string` \| `null`

Defined in: [src/types.ts:170](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L170)

The AG-UI `runId` of the turn that produced this group. `null`/absent for
older streams. Note: an interrupt/resume changes the `runId` mid-turn, so
prefer [StreamGroup.turnId](#turnid) for turn scoping.

***

### status

> **status**: `"error"` \| `"active"` \| `"completed"` \| `"interrupted"` \| `"stopped"`

Defined in: [src/types.ts:202](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L202)

Lifecycle state of the group's run. `"stopped"` is client-derived: when a
run ends (`RUN_FINISHED`/`RUN_ERROR`) with the group still `"active"`, the
activity provider settles it to `"stopped"` so no card spins forever after
an abort — workflows themselves never emit it.

***

### structuredOutput?

> `optional` **structuredOutput?**: `Record`\<`string`, `unknown`\>

Defined in: [src/types.ts:212](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L212)

Structured (schema-shaped) output emitted by the agent, if any.

***

### task?

> `optional` **task?**: `string` \| `null`

Defined in: [src/types.ts:182](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L182)

The task this agent was handed (its latest human/handoff message), shown at
the top of the card so you can see what each agent was asked to do.

***

### timeline

> **timeline**: [`TimelineEntry`](../type-aliases/TimelineEntry.md)[]

Defined in: [src/types.ts:208](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L208)

Interleaved text/tool entries in chronological order.

***

### title

> **title**: `string`

Defined in: [src/types.ts:154](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L154)

Display title for the group's card.

***

### tokens

> **tokens**: `string`

Defined in: [src/types.ts:206](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L206)

Accumulated streamed text tokens for this group.

***

### toolCallId?

> `optional` **toolCallId?**: `string` \| `null`

Defined in: [src/types.ts:164](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L164)

The delegating tool-call id (AG-UI `toolCallId`) that spawned this group.
Stable key for correlating an inline chat card with its activity group.
`null`/absent for the entry agent and non-delegated groups.

***

### tools

> **tools**: [`ToolCall`](ToolCall.md)[]

Defined in: [src/types.ts:204](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L204)

Every tool call made in this group, in call order.

***

### turnId?

> `optional` **turnId?**: `string` \| `null`

Defined in: [src/types.ts:177](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L177)

The logical turn that produced this group — stable across an
interrupt/resume (server-stamped). All groups of one user turn share it, so
the UI can bind them to that turn's single chat reply without fragmenting
on `runId`. `null`/absent for older streams.

***

### usage?

> `optional` **usage?**: [`TokenUsage`](TokenUsage.md)

Defined in: [src/types.ts:216](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L216)

Accumulated LLM token usage for this agent, once it has completed at least once.
