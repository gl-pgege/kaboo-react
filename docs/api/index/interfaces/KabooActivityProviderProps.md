[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooActivityProviderProps

Defined in: [src/context/ActivityProvider.tsx:49](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L49)

Props for [KabooActivityProvider](../functions/KabooActivityProvider.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/context/ActivityProvider.tsx:54](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L54)

CopilotKit agent id whose activity snapshots to consume. Omit to use the
provider's default agent. Agent and thread scoping come from CopilotKit.

***

### children

> **children**: `ReactNode`

Defined in: [src/context/ActivityProvider.tsx:58](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L58)

The subtree that reads activity via [useActivity](../functions/useActivity.md).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/ActivityProvider.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L56)

Renderers for structured agent outputs, keyed by output schema name.
