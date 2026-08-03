[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooInterruptHandlerProps

Defined in: [src/integrations/KabooInterruptHandler.tsx:44](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L44)

Props for [KabooInterruptHandler](../functions/KabooInterruptHandler.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/integrations/KabooInterruptHandler.tsx:46](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L46)

Restrict handling to a single CopilotKit agent (optional).

***

### bridge?

> `optional` **bridge?**: `boolean`

Defined in: [src/integrations/KabooInterruptHandler.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L56)

Also publish the active interrupts to the InterruptBridge so each renders
inside the drill-down detail view (not just the chat). Defaults to `true`;
requires an `InterruptBridgeProvider` (included in `KabooProvider`).

***

### renderers?

> `optional` **renderers?**: `Partial`\<`Record`\<`"approval"` \| `"form"`, `ComponentType`\<[`InterruptRendererProps`](../../index/interfaces/InterruptRendererProps.md)\>\>\>

Defined in: [src/integrations/KabooInterruptHandler.tsx:48](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L48)

Per-interrupt-type renderer overrides.
