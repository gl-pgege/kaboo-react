[**kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [context/KabooProvider.tsx:10](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L10)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### agent

> **agent**: `string`

Defined in: [context/KabooProvider.tsx:14](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L14)

CopilotKit agent id to run (the workflow entry agent).

***

### children

> **children**: `ReactNode`

Defined in: [context/KabooProvider.tsx:28](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L28)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"children"` \| `"agent"` \| `"runtimeUrl"` \| `"threadId"`\>\>

Defined in: [context/KabooProvider.tsx:26](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L26)

Extra props forwarded to the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [context/KabooProvider.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L24)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [context/KabooProvider.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L22)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### interruptRenderers?

> `optional` **interruptRenderers?**: `Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](InterruptRendererProps.md)\>\>\>

Defined in: [context/KabooProvider.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L20)

Per-interrupt-type renderer overrides for the built-in HITL handler.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [context/KabooProvider.tsx:12](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L12)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [context/KabooProvider.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L18)

Renderers for structured agent outputs, keyed by output schema name.

***

### threadId?

> `optional` **threadId?**: `string`

Defined in: [context/KabooProvider.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/KabooProvider.tsx#L16)

Conversation id. Scopes both the run and its activity.
