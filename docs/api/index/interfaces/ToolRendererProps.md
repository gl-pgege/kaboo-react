[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ToolRendererProps

Defined in: [src/context/ToolRenderers.tsx:10](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ToolRenderers.tsx#L10)

Props for a custom per-tool-name renderer supplied via `toolRenderers`.
Receives the full [ToolCall](ToolCall.md) so a rich card can render the input,
the result, and its own interactive state at the tool's chronological
position inside a Timeline.

## Properties

### tool

> **tool**: [`ToolCall`](ToolCall.md)

Defined in: [src/context/ToolRenderers.tsx:12](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ToolRenderers.tsx#L12)

The tool call being rendered.
