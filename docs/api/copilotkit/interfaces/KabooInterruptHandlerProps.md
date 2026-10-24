[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooInterruptHandlerProps

Defined in: [src/integrations/KabooInterruptHandler.tsx:261](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L261)

Props for [KabooInterruptHandler](../functions/KabooInterruptHandler.md).

## Properties

### agentId?

> `optional` **agentId?**: `string`

Defined in: [src/integrations/KabooInterruptHandler.tsx:263](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L263)

Restrict handling to a single CopilotKit agent (optional).

***

### onInterruptError?

> `optional` **onInterruptError?**: (`message`) => `void`

Defined in: [src/integrations/KabooInterruptHandler.tsx:272](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L272)

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

Defined in: [src/integrations/KabooInterruptHandler.tsx:265](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L265)

Renderer overrides keyed by request kind (`approval`, or an app's own).
