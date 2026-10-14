[**@pgege/kaboo-react**](../../README.md)

***

# Function: ApprovalActions()

> **ApprovalActions**(`props`): `ReactElement`

Defined in: src/components/ApprovalActions.tsx:141

The standard approval buttons: Approve, Allow for this chat and Always allow
(only the scopes offered, with "Applies to …" naming what they cover), Deny
with an optional reason, the deadline, and Dismiss once it has passed. The
built-in approval card renders it under its summary; a custom card can do
the same to keep the standard options.

## Parameters

### props

[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\<[`ApprovalReason`](../interfaces/ApprovalReason.md)\>

## Returns

`ReactElement`

## Example

```tsx
import { ApprovalActions, type ApprovalReason, type InterruptRendererProps } from "@pgege/kaboo-react";

function PriceChangeCard(props: InterruptRendererProps<ApprovalReason>) {
  return (
    <div>
      <p>Change the price of this product?</p>
      <ApprovalActions {...props} />
    </div>
  );
}
```
