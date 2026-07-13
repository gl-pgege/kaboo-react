[**@pgege/kaboo-react**](../../README.md)

***

# Interface: StreamGroup

Defined in: [src/types.ts:123](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L123)

One node of kaboo's hierarchical activity tree: a single agent run and its
streamed text, tool calls, timeline, structured output, and (optional)
open interrupt. Groups nest via [StreamGroup.parentGroup](#parentgroup) to form the
drill-down hierarchy.

## Properties

### agentName

> **agentName**: `string`

Defined in: [src/types.ts:127](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L127)

The agent's machine name (used to correlate inline cards).

***

### inlineChatOwner?

> `optional` **inlineChatOwner?**: `boolean`

Defined in: [src/types.ts:166](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L166)

True for a plain-agent entry group: its text and tool calls are already
rendered inline in the chat by the host (CopilotKit), so this group exists
only to enrich those tool rows (labels, formatted results, error status)
and must never be drawn as its own card.

***

### interrupt?

> `optional` **interrupt?**: [`InterruptData`](InterruptData.md)

Defined in: [src/types.ts:176](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L176)

The open interrupt for this group, when it is paused for input.

***

### isChatReply?

> `optional` **isChatReply?**: `boolean`

Defined in: [src/types.ts:159](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L159)

True when this agent's streamed text IS the chat reply (the swarm/graph
`chat_output`, or a delegate manager). Inline cards suppress only this
group's text so the answer isn't duplicated between the card and the bubble.

***

### outputSchemaName?

> `optional` **outputSchemaName?**: `string`

Defined in: [src/types.ts:180](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L180)

Name of the schema for [StreamGroup.structuredOutput](#structuredoutput), selecting a renderer.

***

### parentGroup

> **parentGroup**: `string` \| `null`

Defined in: [src/types.ts:129](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L129)

Parent group id, or `null` for a top-level group.

***

### runId?

> `optional` **runId?**: `string` \| `null`

Defined in: [src/types.ts:141](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L141)

The AG-UI `runId` of the turn that produced this group. `null`/absent for
older streams. Note: an interrupt/resume changes the `runId` mid-turn, so
prefer [StreamGroup.turnId](#turnid) for turn scoping.

***

### status

> **status**: `"error"` \| `"active"` \| `"completed"` \| `"interrupted"`

Defined in: [src/types.ts:168](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L168)

Lifecycle state of the group's run.

***

### structuredOutput?

> `optional` **structuredOutput?**: `Record`\<`string`, `unknown`\>

Defined in: [src/types.ts:178](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L178)

Structured (schema-shaped) output emitted by the agent, if any.

***

### task?

> `optional` **task?**: `string` \| `null`

Defined in: [src/types.ts:153](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L153)

The task this agent was handed (its latest human/handoff message), shown at
the top of the card so you can see what each agent was asked to do.

***

### timeline

> **timeline**: [`TimelineEntry`](../type-aliases/TimelineEntry.md)[]

Defined in: [src/types.ts:174](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L174)

Interleaved text/tool entries in chronological order.

***

### title

> **title**: `string`

Defined in: [src/types.ts:125](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L125)

Display title for the group's card.

***

### tokens

> **tokens**: `string`

Defined in: [src/types.ts:172](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L172)

Accumulated streamed text tokens for this group.

***

### toolCallId?

> `optional` **toolCallId?**: `string` \| `null`

Defined in: [src/types.ts:135](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L135)

The delegating tool-call id (AG-UI `toolCallId`) that spawned this group.
Stable key for correlating an inline chat card with its activity group.
`null`/absent for the entry agent and non-delegated groups.

***

### tools

> **tools**: [`ToolCall`](ToolCall.md)[]

Defined in: [src/types.ts:170](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L170)

Every tool call made in this group, in call order.

***

### turnId?

> `optional` **turnId?**: `string` \| `null`

Defined in: [src/types.ts:148](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L148)

The logical turn that produced this group — stable across an
interrupt/resume (server-stamped). All groups of one user turn share it, so
the UI can bind them to that turn's single chat reply without fragmenting
on `runId`. `null`/absent for older streams.
