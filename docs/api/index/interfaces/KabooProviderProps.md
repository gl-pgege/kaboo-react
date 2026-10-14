[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [src/context/KabooProvider.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L16)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### agent

> **agent**: `string`

Defined in: [src/context/KabooProvider.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L20)

CopilotKit agent id to run (the workflow entry agent).

***

### approvalScopes?

> `optional` **approvalScopes?**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/context/KabooProvider.tsx:35](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L35)

The approval options the app allows. A request offers only the scopes
both the agent and the app allow; `once` is always offered. Defaults to
all three (`once`, `thread`, `always`).

***

### children

> **children**: `ReactNode`

Defined in: [src/context/KabooProvider.tsx:60](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L60)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"children"` \| `"agent"` \| `"runtimeUrl"` \| `"threadId"`\>\>

Defined in: [src/context/KabooProvider.tsx:58](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L58)

Extra props forwarded to the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:45](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L45)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L43)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### interruptRenderers?

> `optional` **interruptRenderers?**: [`InterruptRenderers`](../type-aliases/InterruptRenderers.md)

Defined in: [src/context/KabooProvider.tsx:29](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L29)

Renderer overrides for the built-in HITL handler, keyed by request kind:
`approval`, `form`, or an app's own kind such as `files`.

***

### references?

> `optional` **references?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: [src/context/KabooProvider.tsx:50](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L50)

`@` reference providers made available to the composer / `useReferences`.
File upload is not implicit — include `uploadProvider()` to offer uploads.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [src/context/KabooProvider.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L18)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### slots?

> `optional` **slots?**: [`KabooSlots`](KabooSlots.md)

Defined in: [src/context/KabooProvider.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L56)

App-supplied render slots for the chat surfaces (end-of-turn footer,
per-message footers, run-start indicator). All optional; nothing is
rendered in those positions unless provided.

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/KabooProvider.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L24)

Renderers for structured agent outputs, keyed by output schema name.

***

### threadId?

> `optional` **threadId?**: `string`

Defined in: [src/context/KabooProvider.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L22)

Conversation id. Scopes both the run and its activity.

***

### toolRenderers?

> `optional` **toolRenderers?**: [`ToolRenderers`](../type-aliases/ToolRenderers.md)

Defined in: [src/context/KabooProvider.tsx:41](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L41)

Per-tool-name renderer overrides applied inside every [Timeline](../functions/Timeline.md)
surface (agent cards, drill views). Keyed by exact tool name; a match
replaces the built-in tool row with the app's custom card.
