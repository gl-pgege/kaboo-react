[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [src/context/KabooProvider.tsx:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L15)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### agent

> **agent**: `string`

Defined in: [src/context/KabooProvider.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L19)

CopilotKit agent id to run (the workflow entry agent).

***

### children

> **children**: `ReactNode`

Defined in: [src/context/KabooProvider.tsx:50](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L50)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"children"` \| `"agent"` \| `"threadId"` \| `"runtimeUrl"`\>\>

Defined in: [src/context/KabooProvider.tsx:48](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L48)

Extra props forwarded to the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:35](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L35)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:33](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L33)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### interruptRenderers?

> `optional` **interruptRenderers?**: `Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](InterruptRendererProps.md)\>\>\>

Defined in: [src/context/KabooProvider.tsx:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L25)

Per-interrupt-type renderer overrides for the built-in HITL handler.

***

### references?

> `optional` **references?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: [src/context/KabooProvider.tsx:40](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L40)

`@` reference providers made available to the composer / `useReferences`.
File upload is not implicit — include `uploadProvider()` to offer uploads.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [src/context/KabooProvider.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L17)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### slots?

> `optional` **slots?**: [`KabooSlots`](KabooSlots.md)

Defined in: [src/context/KabooProvider.tsx:46](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L46)

App-supplied render slots for the chat surfaces (end-of-turn footer,
per-message footers, run-start indicator). All optional; nothing is
rendered in those positions unless provided.

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/KabooProvider.tsx:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L23)

Renderers for structured agent outputs, keyed by output schema name.

***

### threadId?

> `optional` **threadId?**: `string`

Defined in: [src/context/KabooProvider.tsx:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L21)

Conversation id. Scopes both the run and its activity.

***

### toolRenderers?

> `optional` **toolRenderers?**: [`ToolRenderers`](../type-aliases/ToolRenderers.md)

Defined in: [src/context/KabooProvider.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L31)

Per-tool-name renderer overrides applied inside every [Timeline](../functions/Timeline.md)
surface (agent cards, drill views). Keyed by exact tool name; a match
replaces the built-in tool row with the app's custom card.
