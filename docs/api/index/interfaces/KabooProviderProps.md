[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [src/context/KabooProvider.tsx:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L15)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### a2ui?

> `optional` **a2ui?**: `object`

Defined in: [src/context/KabooProvider.tsx:69](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L69)

The A2UI catalog, theme and action handler.

#### catalog?

> `optional` **catalog?**: `any`

Optional component catalog to pass to the A2UI renderer.
When omitted, the default basicCatalog is used.

#### includeSchema?

> `optional` **includeSchema?**: `boolean`

When true (the default), the full component schemas from the catalog are
sent as agent context so the agent knows what components and props are
available. The A2UI middleware can overwrite this with a server-side
schema if configured. Set to false to disable.

#### loadingComponent?

> `optional` **loadingComponent?**: `ComponentType`\<\{ \}\>

Optional custom loading component shown while an A2UI surface is generating.
When omitted, a default animated skeleton is shown.

#### recovery?

> `optional` **recovery?**: `A2UIRecoveryRendererOptions`

Options for the A2UI error-recovery status UI (OSS-162): how long before
the transient "Retrying…" hint appears, after how many attempts, and how
much retry/debug detail to surface. When omitted, sane defaults apply.

#### theme?

> `optional` **theme?**: `Theme`

Override the default A2UI viewer theme.
When omitted, the built-in `viewerTheme` from `@copilotkit/a2ui-renderer` is used.

***

### agent

> **agent**: `string`

Defined in: [src/context/KabooProvider.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L19)

CopilotKit agent id to run (the workflow entry agent).

***

### approvalScopes?

> `optional` **approvalScopes?**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/context/KabooProvider.tsx:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L34)

The approval options the app allows. A request offers only the scopes
both the agent and the app allow; `once` is always offered. Defaults to
all three (`once`, `thread`, `always`).

***

### children

> **children**: `ReactNode`

Defined in: [src/context/KabooProvider.tsx:75](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L75)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"agentId"` \| `"children"` \| `"agent"` \| `"threadId"` \| `"runtimeUrl"`\>\>

Defined in: [src/context/KabooProvider.tsx:73](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L73)

Any other props for the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:50](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L50)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:42](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L42)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### interruptRenderers?

> `optional` **interruptRenderers?**: [`InterruptRenderers`](../type-aliases/InterruptRenderers.md)

Defined in: [src/context/KabooProvider.tsx:28](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L28)

Renderer overrides for the built-in HITL handler, keyed by request kind:
`approval`, `form`, or an app's own kind such as `files`.

***

### onInterruptError?

> `optional` **onInterruptError?**: (`message`) => `void`

Defined in: [src/context/KabooProvider.tsx:48](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L48)

Called with the reason when a person's answer never reached the agent;
the requests come back to be answered again. See
[KabooInterruptHandlerProps.onInterruptError](../../copilotkit/interfaces/KabooInterruptHandlerProps.md#oninterrupterror).

#### Parameters

##### message

`string`

#### Returns

`void`

***

### openGenerativeUI?

> `optional` **openGenerativeUI?**: `object`

Defined in: [src/context/KabooProvider.tsx:71](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L71)

Open Generative UI: the sandbox functions and the design skill.

#### designSkill?

> `optional` **designSkill?**: `string`

Design guidelines injected as agent context for the `generateSandboxedUi` tool.
Override this to control the visual style of generated UIs.

A sensible default is provided if omitted.

#### sandboxFunctions?

> `optional` **sandboxFunctions?**: `SandboxFunction`\<`StandardSchemaV1`\<`unknown`, `unknown`\>\>[]

Functions made available inside sandboxed iframes.
Each function is described to the LLM via agent context and exposed
via websandbox's `localApi`.

Inside the iframe, call them with:
```js
await Websandbox.connection.remote.<functionName>(args)
```

***

### properties?

> `optional` **properties?**: `Record`\<`string`, `any`\>

Defined in: [src/context/KabooProvider.tsx:63](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L63)

Sent to the agent as `forwardedProps` with every run.

***

### references?

> `optional` **references?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: [src/context/KabooProvider.tsx:55](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L55)

`@` reference providers made available to the composer / `useReferences`.
File upload is not implicit — include `uploadProvider()` to offer uploads.

***

### renderActivityMessages?

> `optional` **renderActivityMessages?**: `ReactActivityMessageRenderer`\<`any`\>[]

Defined in: [src/context/KabooProvider.tsx:67](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L67)

Renderers for activity messages: A2UI surfaces, Open Generative UI, MCP Apps.

***

### renderToolCalls?

> `optional` **renderToolCalls?**: `ReactToolCallRenderer`\<`any`\>[]

Defined in: [src/context/KabooProvider.tsx:65](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L65)

Renderers for tool calls: the controlled tier of generative UI.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [src/context/KabooProvider.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L17)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### slots?

> `optional` **slots?**: [`KabooSlots`](KabooSlots.md)

Defined in: [src/context/KabooProvider.tsx:61](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L61)

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

Defined in: [src/context/KabooProvider.tsx:40](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L40)

Per-tool-name renderer overrides applied inside every [Timeline](../functions/Timeline.md)
surface (agent cards, drill views). Keyed by exact tool name; a match
replaces the built-in tool row with the app's custom card.
