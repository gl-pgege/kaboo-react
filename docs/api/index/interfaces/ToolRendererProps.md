[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ToolRendererProps

Defined in: [src/context/ToolRenderers.tsx:11](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ToolRenderers.tsx#L11)

Props for a custom per-tool-name renderer supplied via `toolRenderers`.
Receives the full [ToolCall](ToolCall.md) so a rich card can render the input,
the result, and its own interactive state at the tool's chronological
position inside a Timeline.

## Properties

### tool

> **tool**: [`ToolCall`](ToolCall.md)

Defined in: [src/context/ToolRenderers.tsx:13](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ToolRenderers.tsx#L13)

The tool call being rendered.
