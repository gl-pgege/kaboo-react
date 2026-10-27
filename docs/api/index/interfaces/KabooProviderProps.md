[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooProviderProps

Defined in: [src/context/KabooProvider.tsx:18](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L18)

Props for [KabooProvider](../functions/KabooProvider.md).

## Properties

### a2ui?

> `optional` **a2ui?**: `object`

Defined in: [src/context/KabooProvider.tsx:85](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L85)

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

Defined in: [src/context/KabooProvider.tsx:22](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L22)

CopilotKit agent id to run (the workflow entry agent).

***

### approvalScopes?

> `optional` **approvalScopes?**: [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/context/KabooProvider.tsx:37](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L37)

The approval options the app allows. A request offers only the scopes
both the agent and the app allow; `once` is always offered. Defaults to
all three (`once`, `thread`, `always`).

***

### children

> **children**: `ReactNode`

Defined in: [src/context/KabooProvider.tsx:91](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L91)

Your app subtree, rendered inside all kaboo contexts.

***

### copilotKitProps?

> `optional` **copilotKitProps?**: `Partial`\<`Omit`\<`CopilotKitProps`, `"agentId"` \| `"children"` \| `"agent"` \| `"runtimeUrl"` \| `"threadId"`\>\>

Defined in: [src/context/KabooProvider.tsx:89](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L89)

Any other props for the underlying `<CopilotKit>`.

***

### disableInlineCards?

> `optional` **disableInlineCards?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:57](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L57)

Skip auto-mounting the built-in [KabooInlineCards](../../copilotkit/functions/KabooInlineCards.md).

***

### disableInterruptHandler?

> `optional` **disableInterruptHandler?**: `boolean`

Defined in: [src/context/KabooProvider.tsx:49](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L49)

Skip auto-mounting the built-in [KabooInterruptHandler](../../copilotkit/functions/KabooInterruptHandler.md).

***

### fallbackToolRenderer?

> `optional` **fallbackToolRenderer?**: `ComponentType`\<[`ToolRendererProps`](ToolRendererProps.md)\>

Defined in: [src/context/KabooProvider.tsx:44](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L44)

***

### interruptRenderers?

> `optional` **interruptRenderers?**: [`InterruptRenderers`](../type-aliases/InterruptRenderers.md)

Defined in: [src/context/KabooProvider.tsx:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L31)

Renderer overrides for the built-in HITL handler, keyed by request kind:
`approval`, `form`, or an app's own kind such as `files`.

***

### isReadOnlyTool?

> `optional` **isReadOnlyTool?**: (`toolName`) => `boolean`

Defined in: [src/context/KabooProvider.tsx:47](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L47)

#### Parameters

##### toolName

`string`

#### Returns

`boolean`

***

### markdownRenderer?

> `optional` **markdownRenderer?**: (`text`) => `ReactNode`

Defined in: [src/context/KabooProvider.tsx:45](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L45)

#### Parameters

##### text

`string`

#### Returns

`ReactNode`

***

### onInterruptError?

> `optional` **onInterruptError?**: (`message`) => `void`

Defined in: [src/context/KabooProvider.tsx:55](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L55)

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

Defined in: [src/context/KabooProvider.tsx:87](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L87)

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

Defined in: [src/context/KabooProvider.tsx:70](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L70)

Sent to the agent as `forwardedProps` with every run.

***

### references?

> `optional` **references?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: [src/context/KabooProvider.tsx:62](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L62)

`@` reference providers made available to the composer / `useReferences`.
File upload is not implicit — include `uploadProvider()` to offer uploads.

***

### renderActivityMessages?

> `optional` **renderActivityMessages?**: `ReactActivityMessageRenderer`\<`any`\>[]

Defined in: [src/context/KabooProvider.tsx:77](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L77)

Renderers for activity messages: A2UI surfaces, Open Generative UI, MCP
Apps. kaboo-react adds its own for the notice it shows where a run failed.

***

### renderAgentResult?

> `optional` **renderAgentResult?**: (`group`) => `ReactNode`

Defined in: [src/context/KabooProvider.tsx:46](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L46)

#### Parameters

##### group

[`StreamGroup`](StreamGroup.md)

#### Returns

`ReactNode`

***

### renderToolCalls?

> `optional` **renderToolCalls?**: `ReactToolCallRenderer`\<`any`\>[]

Defined in: [src/context/KabooProvider.tsx:72](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L72)

Renderers for tool calls: the controlled tier of generative UI.

***

### runtimeUrl

> **runtimeUrl**: `string`

Defined in: [src/context/KabooProvider.tsx:20](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L20)

URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`).

***

### slots?

> `optional` **slots?**: [`KabooSlots`](KabooSlots.md)

Defined in: [src/context/KabooProvider.tsx:68](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L68)

App-supplied render slots for the chat surfaces (end-of-turn footer,
per-message footers, run-start indicator). All optional; nothing is
rendered in those positions unless provided.

***

### structuredRenderers?

> `optional` **structuredRenderers?**: [`StructuredRenderers`](../type-aliases/StructuredRenderers.md)

Defined in: [src/context/KabooProvider.tsx:26](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L26)

Renderers for structured agent outputs, keyed by output schema name.

***

### threadId?

> `optional` **threadId?**: `string`

Defined in: [src/context/KabooProvider.tsx:24](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L24)

Conversation id. Scopes both the run and its activity.

***

### throttleMs?

> `optional` **throttleMs?**: `number`

Defined in: [src/context/KabooProvider.tsx:83](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L83)

The shortest interval, in milliseconds, between two re-renders while a run
streams: CopilotKit's `defaultThrottleMs` and the activity cards' own.
Defaults to 50; `0` re-renders on every event.

***

### toolRenderers?

> `optional` **toolRenderers?**: [`ToolRenderers`](../type-aliases/ToolRenderers.md)

Defined in: [src/context/KabooProvider.tsx:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/KabooProvider.tsx#L43)

Per-tool-name renderer overrides applied inside every [Timeline](../functions/Timeline.md)
surface (agent cards, drill views). Keyed by exact tool name; a match
replaces the built-in tool row with the app's custom card.
