[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: ToolRenderers

> **ToolRenderers** = `Record`\<`string`, `ComponentType`\<[`ToolRendererProps`](../interfaces/ToolRendererProps.md)\>\>

Defined in: [src/context/ToolRenderers.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ToolRenderers.tsx#L22)

Per-tool-name renderer overrides, keyed by the exact tool name (e.g.
`create_work_item`). A registered renderer replaces the built-in
[ToolRow](../functions/ToolRow.md) for that tool everywhere a [Timeline](../functions/Timeline.md) draws it —
top-level agent cards, nested drill views, and sub-agent activity — so
interactive tool cards look the same at every depth.
