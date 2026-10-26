[**@pgege/kaboo-react**](../../README.md)

***

# Function: ToolRenderersProvider()

> **ToolRenderersProvider**(`__namedParameters`): `Element`

Defined in: [src/context/ToolRenderers.tsx:37](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ToolRenderers.tsx#L37)

Makes the app's `toolRenderers` overrides available to every Timeline
surface. Included automatically by [KabooProvider](KabooProvider.md); mount it manually
only when composing kaboo contexts yourself.

## Parameters

### \_\_namedParameters

`Pick`\<[`KabooProviderProps`](../interfaces/KabooProviderProps.md), `"fallbackToolRenderer"` \| `"markdownRenderer"` \| `"renderAgentResult"` \| `"isReadOnlyTool"`\> & `object`

## Returns

`Element`
