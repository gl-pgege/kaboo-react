[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooInterruptHandler()

> **KabooInterruptHandler**(`__namedParameters`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [src/integrations/KabooInterruptHandler.tsx:67](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L67)

Ready-made human-in-the-loop interrupt handler. CopilotKit surfaces every open
interrupt of a run at once (e.g. two gated tools called in parallel); we render
one card per interrupt and resolve each independently by its own id. The client
accumulates the per-id responses and only resumes the run once every open
interrupt has been answered — so resolving with `intr.id` (never the bare
`resolve()`, which would only ever answer the first) is what keeps N parallel
gates from wedging. Prompts anchored to an on-screen tool render inline at that
tool's position; the rest fall back to the chat slot.

## Parameters

### \_\_namedParameters

[`KabooInterruptHandlerProps`](../interfaces/KabooInterruptHandlerProps.md)

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`
