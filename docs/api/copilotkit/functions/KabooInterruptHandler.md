[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooInterruptHandler()

> **KabooInterruptHandler**(`__namedParameters`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [src/integrations/KabooInterruptHandler.tsx:296](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L296)

Ready-made human-in-the-loop interrupt handler. CopilotKit surfaces every open
interrupt of a run at once (e.g. two gated tools called in parallel); we render
one card per interrupt and resolve each independently by its own id. The client
accumulates the per-id responses and only resumes the run once every open
interrupt has been answered — so resolving with `intr.id` (never the bare
`resolve()`, which would only ever answer the first) is what keeps N parallel
gates from wedging. Prompts anchored to an on-screen tool render inline at that
tool's position; the rest fall back to the chat slot.

Two or more approvals waiting at once get "Approve all" and "Deny all". A
message sent while anything waits skips it, so the chat is never stuck.

When answers never reach the agent (the host refuses a decision, or the
request fails), the requests come back to be answered again, with the reason
above them and passed to `onInterruptError`.

## Parameters

### \_\_namedParameters

[`KabooInterruptHandlerProps`](../interfaces/KabooInterruptHandlerProps.md)

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

## Example

```tsx
import { CopilotKit } from "@copilotkit/react-core/v2";
import { InterruptBridgeProvider } from "@pgege/kaboo-react";
import { KabooInterruptHandler } from "@pgege/kaboo-react/copilotkit";

function Hitl({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="assistant">
      <InterruptBridgeProvider>
        <KabooInterruptHandler agentId="assistant" />
        {children}
      </InterruptBridgeProvider>
    </CopilotKit>
  );
}
```
