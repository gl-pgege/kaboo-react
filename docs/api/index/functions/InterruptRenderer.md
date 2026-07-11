[**@pgege/kaboo-react**](../../README.md)

***

# Function: InterruptRenderer()

> **InterruptRenderer**(`props`): `ReactElement`

Defined in: [components/InterruptRenderer.tsx:322](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/InterruptRenderer.tsx#L322)

Default human-in-the-loop interrupt UI. Renders an Approve/Reject panel for an
[ApprovalReason](../interfaces/ApprovalReason.md) and a (optionally multi-step) form with radio/checkbox/
text inputs for a [FormReason](../interfaces/FormReason.md), calling `onResolve`/`onCancel` with the
answer payload. Override per type via `interruptRenderers` on
[KabooProvider](KabooProvider.md).

## Parameters

### props

[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)

## Returns

`ReactElement`

## Example

```tsx
import { InterruptRenderer } from "@pgege/kaboo-react";
import type { InterruptReason } from "@pgege/kaboo-react";

const reason: InterruptReason = {
  type: "approval",
  message: "Run this query?",
  tool_name: "run_sql",
};

function Example() {
  return (
    <InterruptRenderer
      reason={reason}
      onResolve={() => {}}
      onCancel={() => {}}
    />
  );
}
```
