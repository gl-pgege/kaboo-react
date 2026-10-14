[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooInterruptHandlerProps

Defined in: [src/integrations/KabooInterruptHandler.tsx:153](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L153)

Props for [KabooInterruptHandler](../functions/KabooInterruptHandler.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/integrations/KabooInterruptHandler.tsx:155](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L155)

Restrict handling to a single CopilotKit agent (optional).

***

### bridge?

> `optional` **bridge?**: `boolean`

Defined in: [src/integrations/KabooInterruptHandler.tsx:163](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L163)

Also publish the active interrupts to the InterruptBridge so each renders
inside the drill-down detail view (not just the chat). Defaults to `true`;
requires an `InterruptBridgeProvider` (included in `KabooProvider`).

***

### renderers?

> `optional` **renderers?**: [`InterruptRenderers`](../../index/type-aliases/InterruptRenderers.md)

Defined in: [src/integrations/KabooInterruptHandler.tsx:157](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L157)

Renderer overrides keyed by request kind (`approval`, `form`, or an app's own).
