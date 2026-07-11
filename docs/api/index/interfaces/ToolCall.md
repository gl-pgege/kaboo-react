[**kaboo-react**](../../README.md)

***

# Interface: ToolCall

Defined in: [types.ts:6](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L6)

A single tool invocation captured within an agent's activity group. One
`ToolCall` maps to one AG-UI tool-call and carries enough state to render the
live tool row, its input summary, and its result (or cancellation).

## Properties

### status

> **status**: `"running"` \| `"done"` \| `"success"` \| `"error"` \| `"cancelled"`

Defined in: [types.ts:18](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L18)

Lifecycle state of the call, driving the row's icon and status text.

***

### toolInput?

> `optional` **toolInput?**: `unknown`

Defined in: [types.ts:14](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L14)

The raw tool input (arbitrary JSON), summarized by the formatters.

***

### toolLabel?

> `optional` **toolLabel?**: `string`

Defined in: [types.ts:12](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L12)

Optional human-friendly label shown instead of `toolName`.

***

### toolName

> **toolName**: `string`

Defined in: [types.ts:10](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L10)

The tool's machine name (e.g. `run_sql`, `ask_user`).

***

### toolResult?

> `optional` **toolResult?**: `string`

Defined in: [types.ts:16](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L16)

The raw tool result, if the call has completed.

***

### toolUseId

> **toolUseId**: `string`

Defined in: [types.ts:8](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/types.ts#L8)

AG-UI tool-call id. Stable key used to correlate rows, cards, and gates.
