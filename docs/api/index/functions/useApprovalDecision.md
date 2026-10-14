[**@pgege/kaboo-react**](../../README.md)

***

# Function: useApprovalDecision()

> **useApprovalDecision**(`__namedParameters`): [`ApprovalDecisionControls`](../interfaces/ApprovalDecisionControls.md)

Defined in: src/components/ApprovalActions.tsx:59

The standard approval decisions for a card: which scopes to offer, the
deadline, and approve / deny / dismiss bound to the request. Use it to build
a custom approval card that behaves like the built-in one, or render
[ApprovalActions](ApprovalActions.md) for the standard buttons.

## Parameters

### \_\_namedParameters

[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\<[`ApprovalReason`](../interfaces/ApprovalReason.md)\>

## Returns

[`ApprovalDecisionControls`](../interfaces/ApprovalDecisionControls.md)

## Example

```tsx
import { useApprovalDecision, type ApprovalReason, type InterruptRendererProps } from "@pgege/kaboo-react";

function OneClickApproval(props: InterruptRendererProps<ApprovalReason>) {
  const decision = useApprovalDecision(props);
  if (decision.responded) return <p>Sent.</p>;
  return <button onClick={() => decision.approve("once")}>Approve {props.reason.tool_name}</button>;
}
```
