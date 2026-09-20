[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: TimelineEntry

> **TimelineEntry** = \{ `text`: `string`; `type`: `"text"`; \} \| \{ `tool?`: [`ToolCall`](../interfaces/ToolCall.md); `toolUseId?`: `string`; `type`: `"tool"`; \}

Defined in: [src/types.ts:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L25)

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

\{ `tool?`: [`ToolCall`](../interfaces/ToolCall.md); `toolUseId?`: `string`; `type`: `"tool"`; \}

#### ~~tool?~~

> `optional` **tool?**: [`ToolCall`](../interfaces/ToolCall.md)

The embedded call. Producers before the reference form inlined it
here, which serialised every input and result twice per snapshot;
threads persisted then still replay, so it is read when present.

##### Deprecated

Prefer `toolUseId`.

#### toolUseId?

> `optional` **toolUseId?**: `string`

Reference to the call in the owning group's `tools`, which holds the
only copy. Resolve it with `resolveTimelineTool`.

#### type

> **type**: `"tool"`

Discriminator: a tool call.
