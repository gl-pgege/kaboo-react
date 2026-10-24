[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooActivityProviderProps

Defined in: [src/context/ActivityProvider.tsx:54](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L54)

Props for [KabooActivityProvider](../functions/KabooActivityProvider.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/context/ActivityProvider.tsx:59](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L59)

CopilotKit agent id whose run stream to read. Omit to use the provider's
default agent. Agent and thread scoping come from CopilotKit.

***

### children

> **children**: `ReactNode`

Defined in: [src/context/ActivityProvider.tsx:63](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L63)

The subtree that reads activity via [useActivity](../functions/useActivity.md).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/ActivityProvider.tsx:61](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/ActivityProvider.tsx#L61)

Renderers for structured agent outputs, keyed by output schema name.
