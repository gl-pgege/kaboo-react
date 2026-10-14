[**@pgege/kaboo-react**](../../README.md)

***

# Function: useApprovalScopes()

> **useApprovalScopes**(): readonly [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

Defined in: [src/context/InterruptRenderers.tsx:105](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptRenderers.tsx#L105)

The approval scopes the app allows (`approvalScopes` on
[KabooProvider](KabooProvider.md)), for custom approval cards.

## Returns

readonly [`ApprovalScope`](../type-aliases/ApprovalScope.md)[]

## Example

```tsx
import { useApprovalScopes } from "@pgege/kaboo-react";

function RememberHint() {
  const scopes = useApprovalScopes();
  return scopes.includes("always") ? <span>Decisions can be remembered</span> : null;
}
```
