[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooRequestToolOptions\<T\>

Defined in: [src/requests/useRequestTool.tsx:35](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L35)

Options for [useRequestTool](../functions/useRequestTool.md).

## Type Parameters

### T

`T`

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/requests/useRequestTool.tsx:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L43)

Offer the tool to this agent only.

***

### description

> **description**: `string`

Defined in: [src/requests/useRequestTool.tsx:39](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L39)

What the agent reads about the tool.

***

### name

> **name**: `string`

Defined in: [src/requests/useRequestTool.tsx:37](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L37)

The tool's name, as agents' `client_tools` allow-lists name it.

***

### parameters

> **parameters**: [`KabooToolSchema`](KabooToolSchema.md)\<`T`\>

Defined in: [src/requests/useRequestTool.tsx:41](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L41)

The arguments schema. Calls that fail it are answered with the problems, so the agent can retry.

***

### render

> **render**: (`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [src/requests/useRequestTool.tsx:45](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L45)

The panel: a component, defined outside the one that registers the tool so it keeps its state.

#### Parameters

##### props

[`KabooRequestRenderProps`](KabooRequestRenderProps.md)\<`T`\>

#### Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`
