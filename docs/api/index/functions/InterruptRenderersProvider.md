[**@pgege/kaboo-react**](../../README.md)

***

# Function: InterruptRenderersProvider()

> **InterruptRenderersProvider**(`__namedParameters`): `Element`

Defined in: [src/context/InterruptRenderers.tsx:47](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptRenderers.tsx#L47)

Makes the app's `interruptRenderers` overrides available to every surface
that renders an interrupt prompt — the chat-level slot, a Timeline's inline
tool anchor, and the wildcard tool row — so a custom card applies uniformly
no matter where the gate is anchored. Also carries `approvalScopes`, the
approval options the app allows. Included automatically by
[KabooProvider](KabooProvider.md).

## Parameters

### \_\_namedParameters

#### approvalScopes?

readonly [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

The approval scopes the app allows. A request offers only the scopes both
the agent and the app allow; `once` is always offered. Defaults to all.

#### children

`ReactNode`

#### renderers?

[`InterruptRenderers`](../type-aliases/InterruptRenderers.md)

## Returns

`Element`

## Example

```tsx
import { InterruptRenderersProvider } from "@pgege/kaboo-react";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InterruptRenderersProvider approvalScopes={["once", "thread"]}>
      {children}
    </InterruptRenderersProvider>
  );
}
```
