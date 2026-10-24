[**@pgege/kaboo-react**](../../README.md)

***

# Interface: UseAskUserToolOptions

Defined in: [src/requests/useAskUserTool.tsx:10](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useAskUserTool.tsx#L10)

Options for [useAskUserTool](../functions/useAskUserTool.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/requests/useAskUserTool.tsx:12](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useAskUserTool.tsx#L12)

Offer the tool to this agent only.

***

### description?

> `optional` **description?**: `string`

Defined in: [src/requests/useAskUserTool.tsx:14](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useAskUserTool.tsx#L14)

What the agent reads about the tool; the default suits most agents.

***

### render?

> `optional` **render?**: (`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [src/requests/useAskUserTool.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useAskUserTool.tsx#L16)

A panel of your own in place of [AskUserPanel](../functions/AskUserPanel.md).

#### Parameters

##### props

[`KabooRequestRenderProps`](KabooRequestRenderProps.md)\<[`AskUserArgs`](AskUserArgs.md)\>

#### Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`
