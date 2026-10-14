[**@pgege/kaboo-react**](../../README.md)

***

# Function: useInterruptRenderer()

> **useInterruptRenderer**(`type`): `ComponentType`\<[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\<`any`\>\>

Defined in: [src/context/InterruptRenderers.tsx:84](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptRenderers.tsx#L84)

The renderer for a request kind: the app's override when one was provided,
otherwise the built-in [InterruptRenderer](InterruptRenderer.md) (approval and question
cards, and a minimal card for any other kind).

## Parameters

### type

`string`

## Returns

`ComponentType`\<[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\<`any`\>\>

## Example

```tsx
import { useInterruptRenderer, type InterruptReason } from "@pgege/kaboo-react";

function Prompt({ reason }: { reason: InterruptReason }) {
  const Renderer = useInterruptRenderer(reason.type);
  return <Renderer reason={reason} onResolve={() => {}} onCancel={() => {}} />;
}
```
