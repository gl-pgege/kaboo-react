[**@kaboo/react**](../../README.md)

***

# Interface: TimelineProps

Defined in: [components/Timeline.tsx:75](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L75)

Props for [Timeline](../functions/Timeline.md).

## Properties

### active

> **active**: `boolean`

Defined in: [components/Timeline.tsx:79](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L79)

When true, a blinking cursor is shown after the last text segment.

***

### renderToolCard?

> `optional` **renderToolCard?**: (`toolUseId`) => `ReactNode`

Defined in: [components/Timeline.tsx:88](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L88)

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

Defined in: [components/Timeline.tsx:77](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L77)

The interleaved text/tool entries to render, in order.

***

### variant?

> `optional` **variant?**: `"card"` \| `"drill"`

Defined in: [components/Timeline.tsx:81](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/Timeline.tsx#L81)

Visual variant selecting the text container class.
