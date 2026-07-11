[**kaboo-react**](../../README.md)

***

# Type Alias: TimelineEntry

> **TimelineEntry** = \{ `text`: `string`; `type`: `"text"`; \} \| \{ `tool`: [`ToolCall`](../interfaces/ToolCall.md); `type`: `"tool"`; \}

Defined in: [types.ts:25](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L25)

One chronological entry in an agent's timeline: either a streamed text segment
or a tool call, interleaved in the order they occurred.

## Union Members

### Type Literal

\{ `text`: `string`; `type`: `"text"`; \}

#### text

> **text**: `string`

The streamed text for this segment.

#### type

> **type**: `"text"`

Discriminator: a streamed text segment.

***

### Type Literal

\{ `tool`: [`ToolCall`](../interfaces/ToolCall.md); `type`: `"tool"`; \}

#### tool

> **tool**: [`ToolCall`](../interfaces/ToolCall.md)

The tool call for this entry.

#### type

> **type**: `"tool"`

Discriminator: a tool call.
