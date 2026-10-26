[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: TimelineEntry

> **TimelineEntry** = \{ `text`: `string`; `type`: `"text"`; \} \| \{ `toolUseId`: `string`; `type`: `"tool"`; \}

Defined in: [src/types.ts:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L29)

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

\{ `toolUseId`: `string`; `type`: `"tool"`; \}

#### toolUseId

> **toolUseId**: `string`

Reference to the call in the owning group's `tools`, which holds the
only copy. Resolve it with `resolveTimelineTool`.

#### type

> **type**: `"tool"`

Discriminator: a tool call.
