[**kaboo-react**](../../README.md)

***

# Interface: KabooInterruptHandlerProps

Defined in: [integrations/KabooInterruptHandler.tsx:42](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/integrations/KabooInterruptHandler.tsx#L42)

Props for [KabooInterruptHandler](../functions/KabooInterruptHandler.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [integrations/KabooInterruptHandler.tsx:44](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/integrations/KabooInterruptHandler.tsx#L44)

Restrict handling to a single CopilotKit agent (optional).

***

### bridge?

> `optional` **bridge?**: `boolean`

Defined in: [integrations/KabooInterruptHandler.tsx:54](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/integrations/KabooInterruptHandler.tsx#L54)

Also publish the active interrupts to the InterruptBridge so each renders
inside the drill-down detail view (not just the chat). Defaults to `true`;
requires an `InterruptBridgeProvider` (included in `KabooProvider`).

***

### renderers?

> `optional` **renderers?**: `Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](../../index/interfaces/InterruptRendererProps.md)\>\>\>

Defined in: [integrations/KabooInterruptHandler.tsx:46](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/integrations/KabooInterruptHandler.tsx#L46)

Per-interrupt-type renderer overrides.
