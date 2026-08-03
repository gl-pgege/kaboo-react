[**@pgege/kaboo-react**](../../README.md)

***

# Function: InterruptRenderersProvider()

> **InterruptRenderersProvider**(`__namedParameters`): `Element`

Defined in: src/context/InterruptRenderers.tsx:19

Makes the app's `interruptRenderers` overrides available to every surface
that renders an interrupt prompt — the chat-level slot, a Timeline's inline
tool anchor, and the wildcard tool row — so a custom card applies uniformly
no matter where the gate is anchored. Included automatically by
[KabooProvider](KabooProvider.md).

## Parameters

### \_\_namedParameters

#### children

`ReactNode`

#### renderers?

`Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\>\>\>

## Returns

`Element`
