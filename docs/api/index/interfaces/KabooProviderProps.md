[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [src/context/KabooProvider.tsx:12](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L12)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### agent

> **agent**: `string`

Defined in: [src/context/KabooProvider.tsx:16](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L16)

CopilotKit agent id to run (the workflow entry agent).

***

### children

> **children**: `ReactNode`

Defined in: [src/context/KabooProvider.tsx:35](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L35)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"children"` \| `"agent"` \| `"runtimeUrl"` \| `"threadId"`\>\>

Defined in: [src/context/KabooProvider.tsx:33](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L33)

Extra props forwarded to the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:26](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L26)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L24)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### interruptRenderers?

> `optional` **interruptRenderers?**: `Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](InterruptRendererProps.md)\>\>\>

Defined in: [src/context/KabooProvider.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L22)

Per-interrupt-type renderer overrides for the built-in HITL handler.

***

### references?

> `optional` **references?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: [src/context/KabooProvider.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L31)

`@` reference providers made available to the composer / `useReferences`.
File upload is not implicit — include `uploadProvider()` to offer uploads.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [src/context/KabooProvider.tsx:14](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L14)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/KabooProvider.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L20)

Renderers for structured agent outputs, keyed by output schema name.

***

### threadId?

> `optional` **threadId?**: `string`

Defined in: [src/context/KabooProvider.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L18)

Conversation id. Scopes both the run and its activity.
