[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooActivityProviderProps

Defined in: [src/context/ActivityProvider.tsx:50](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L50)

Props for [KabooActivityProvider](../functions/KabooActivityProvider.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/context/ActivityProvider.tsx:55](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L55)

CopilotKit agent id whose activity snapshots to consume. Omit to use the
provider's default agent. Agent and thread scoping come from CopilotKit.

***

### children

> **children**: `ReactNode`

Defined in: [src/context/ActivityProvider.tsx:59](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L59)

The subtree that reads activity via [useActivity](../functions/useActivity.md).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/ActivityProvider.tsx:57](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L57)

Renderers for structured agent outputs, keyed by output schema name.
