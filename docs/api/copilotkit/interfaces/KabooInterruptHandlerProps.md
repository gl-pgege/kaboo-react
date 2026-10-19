[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooInterruptHandlerProps

Defined in: [src/integrations/KabooInterruptHandler.tsx:241](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L241)

Props for [KabooInterruptHandler](../functions/KabooInterruptHandler.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/integrations/KabooInterruptHandler.tsx:243](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L243)

Restrict handling to a single CopilotKit agent (optional).

***

### bridge?

> `optional` **bridge?**: `boolean`

Defined in: [src/integrations/KabooInterruptHandler.tsx:251](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L251)

Also publish the active interrupts to the InterruptBridge so each renders
inside the drill-down detail view (not just the chat). Defaults to `true`;
requires an `InterruptBridgeProvider` (included in `KabooProvider`).

***

### onInterruptError?

> `optional` **onInterruptError?**: (`message`) => `void`

Defined in: [src/integrations/KabooInterruptHandler.tsx:258](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L258)

Called with the reason when an answer never reached the agent (the host
refused it, or it couldn't be sent). The requests come back to be
answered again either way; use this to show the reason elsewhere too,
such as a toast.

#### Parameters

##### message

`string`

#### Returns

`void`

***

### renderers?

> `optional` **renderers?**: [`InterruptRenderers`](../../index/type-aliases/InterruptRenderers.md)

Defined in: [src/integrations/KabooInterruptHandler.tsx:245](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L245)

Renderer overrides keyed by request kind (`approval`, `form`, or an app's own).
