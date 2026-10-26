[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TimelineProps

Defined in: [src/components/Timeline.tsx:110](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L110)

Props for [Timeline](../functions/Timeline.md).

## Properties

### active

> **active**: `boolean`

Defined in: [src/components/Timeline.tsx:120](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L120)

When true, a blinking cursor is shown after the last text segment.

***

### agentName?

> `optional` **agentName?**: `string`

Defined in: [src/components/Timeline.tsx:130](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L130)

***

### renderToolCard?

> `optional` **renderToolCard?**: (`toolUseId`) => `ReactNode`

Defined in: [src/components/Timeline.tsx:129](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L129)

Optional hook to render a delegating tool call as its spawned sub-agent
card, interleaved at its chronological position. Returns the card node for a
given tool-call id, or `null`/`undefined` to fall back to the tool row. Keeps
a delegated agent's work in order relative to the parent's surrounding text.

#### Parameters

##### toolUseId

`string`

#### Returns

`ReactNode`

***

### timeline

> **timeline**: [`TimelineEntry`](../type-aliases/TimelineEntry.md)[]

Defined in: [src/components/Timeline.tsx:112](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L112)

The interleaved text/tool entries to render, in order.

***

### tools

> **tools**: [`ToolCall`](ToolCall.md)[]

Defined in: [src/components/Timeline.tsx:118](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L118)

The owning group's tool calls. Timeline tool entries reference these by
`toolUseId` rather than embedding them, so they are needed to render a
tool row.

***

### variant?

> `optional` **variant?**: `"card"` \| `"drill"`

Defined in: [src/components/Timeline.tsx:122](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L122)

Visual variant selecting the text container class.
