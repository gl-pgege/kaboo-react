[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooInterruptHandler()

> **KabooInterruptHandler**(`__namedParameters`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [src/integrations/KabooInterruptHandler.tsx:301](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/KabooInterruptHandler.tsx#L301)

Ready-made handler for the requests a run pauses on: approvals and an app's
own request kinds, on CopilotKit's `useInterrupt`. Every open request of a
pause renders at once, each answered by its own id; the run resumes once all
are answered. A sub-agent's request names the agent that made it.

A message sent while requests wait skips them (see `useKabooSend`). When
answers never reach the agent (the host refuses a decision, or the request
fails), the requests come back to be answered again, with the reason above
them and passed to `onInterruptError`.

## Parameters

### \_\_namedParameters

[`KabooInterruptHandlerProps`](../interfaces/KabooInterruptHandlerProps.md)

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

## Example

```tsx
import { CopilotKit } from "@copilotkit/react-core/v2";
import { KabooInterruptHandler } from "@pgege/kaboo-react/copilotkit";

function Hitl({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="assistant">
      <KabooInterruptHandler agentId="assistant" />
      {children}
    </CopilotKit>
  );
}
```
