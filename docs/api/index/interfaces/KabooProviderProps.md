[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [src/context/KabooProvider.tsx:14](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L14)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### agent

> **agent**: `string`

Defined in: [src/context/KabooProvider.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L18)

CopilotKit agent id to run (the workflow entry agent).

***

### children

> **children**: `ReactNode`

Defined in: [src/context/KabooProvider.tsx:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L43)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"children"` \| `"agent"` \| `"runtimeUrl"` \| `"threadId"`\>\>

Defined in: [src/context/KabooProvider.tsx:41](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L41)

Extra props forwarded to the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L34)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:32](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L32)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### interruptRenderers?

> `optional` **interruptRenderers?**: `Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](InterruptRendererProps.md)\>\>\>

Defined in: [src/context/KabooProvider.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L24)

Per-interrupt-type renderer overrides for the built-in HITL handler.

***

### references?

> `optional` **references?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: [src/context/KabooProvider.tsx:39](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L39)

`@` reference providers made available to the composer / `useReferences`.
File upload is not implicit — include `uploadProvider()` to offer uploads.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [src/context/KabooProvider.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L16)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/KabooProvider.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L22)

Renderers for structured agent outputs, keyed by output schema name.

***

### threadId?

> `optional` **threadId?**: `string`

Defined in: [src/context/KabooProvider.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L20)

Conversation id. Scopes both the run and its activity.

***

### toolRenderers?

> `optional` **toolRenderers?**: [`ToolRenderers`](../type-aliases/ToolRenderers.md)

Defined in: [src/context/KabooProvider.tsx:30](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L30)

Per-tool-name renderer overrides applied inside every [Timeline](../functions/Timeline.md)
surface (agent cards, drill views). Keyed by exact tool name; a match
replaces the built-in tool row with the app's custom card.
