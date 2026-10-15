[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TimelineProps

Defined in: [src/components/Timeline.tsx:36](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L36)

Props for [Timeline](../functions/Timeline.md).

## Properties

### active

> **active**: `boolean`

Defined in: [src/components/Timeline.tsx:46](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L46)

When true, a blinking cursor is shown after the last text segment.

***

### renderToolCard?

> `optional` **renderToolCard?**: (`toolUseId`) => `ReactNode`

Defined in: [src/components/Timeline.tsx:55](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L55)

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

Defined in: [src/components/Timeline.tsx:38](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L38)

The interleaved text/tool entries to render, in order.

***

### tools

> **tools**: [`ToolCall`](ToolCall.md)[]

Defined in: [src/components/Timeline.tsx:44](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L44)

The owning group's tool calls. Timeline tool entries reference these by
`toolUseId` rather than embedding them, so they are needed to render a
tool row.

***

### variant?

> `optional` **variant?**: `"card"` \| `"drill"`

Defined in: [src/components/Timeline.tsx:48](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L48)

Visual variant selecting the text container class.
