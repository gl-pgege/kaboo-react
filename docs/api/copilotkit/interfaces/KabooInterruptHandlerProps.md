[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooInterruptHandlerProps

Defined in: [src/integrations/KabooInterruptHandler.tsx:142](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L142)

Props for [KabooInterruptHandler](../functions/KabooInterruptHandler.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/integrations/KabooInterruptHandler.tsx:144](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L144)

Restrict handling to a single CopilotKit agent (optional).

***

### bridge?

> `optional` **bridge?**: `boolean`

Defined in: [src/integrations/KabooInterruptHandler.tsx:152](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L152)

Also publish the active interrupts to the InterruptBridge so each renders
inside the drill-down detail view (not just the chat). Defaults to `true`;
requires an `InterruptBridgeProvider` (included in `KabooProvider`).

***

### renderers?

> `optional` **renderers?**: [`InterruptRenderers`](../../index/type-aliases/InterruptRenderers.md)

Defined in: [src/integrations/KabooInterruptHandler.tsx:146](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L146)

Renderer overrides keyed by request kind (`approval`, `form`, or an app's own).
