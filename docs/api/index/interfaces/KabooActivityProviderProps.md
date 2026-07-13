[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooActivityProviderProps

Defined in: [src/context/ActivityProvider.tsx:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L29)

Props for [KabooActivityProvider](../functions/KabooActivityProvider.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/context/ActivityProvider.tsx:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L34)

CopilotKit agent id whose activity snapshots to consume. Omit to use the
provider's default agent. Agent and thread scoping come from CopilotKit.

***

### children

> **children**: `ReactNode`

Defined in: [src/context/ActivityProvider.tsx:38](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L38)

The subtree that reads activity via [useActivity](../functions/useActivity.md).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/ActivityProvider.tsx:36](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L36)

Renderers for structured agent outputs, keyed by output schema name.
