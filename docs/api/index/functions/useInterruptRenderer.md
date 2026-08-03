[**@pgege/kaboo-react**](../../README.md)

***

# Function: useInterruptRenderer()

> **useInterruptRenderer**(`type`): `ComponentType`\<[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\>

Defined in: [src/context/InterruptRenderers.tsx:37](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptRenderers.tsx#L37)

The renderer for a given interrupt reason type: the app's override when one
was provided, otherwise the built-in [InterruptRenderer](InterruptRenderer.md).

## Parameters

### type

`"approval"` \| `"form"`

## Returns

`ComponentType`\<[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\>
