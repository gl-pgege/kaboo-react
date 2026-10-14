[**@pgege/kaboo-react**](../../README.md)

***

# Function: InterruptRenderer()

> **InterruptRenderer**(`props`): `ReactElement`

Defined in: [src/components/InterruptRenderer.tsx:276](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/InterruptRenderer.tsx#L276)

Default human-in-the-loop interrupt UI: the approval card (Approve, Allow
for this chat, Always allow, Deny with a reason — see
[ApprovalActions](ApprovalActions.md)), the multiple-choice question card (single or
multi-select, Other on every question, Submit and Skip, stepping through
several questions), and a minimal card with Skip for an app's own request
kind that has no registered renderer. Override per kind via
`interruptRenderers` on [KabooProvider](KabooProvider.md); style it with the documented
`kaboo-interrupt-*` and `kaboo-approval-*` classes.

## Parameters

### props

[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\<[`CustomRequestReason`](../interfaces/CustomRequestReason.md) \| [`InterruptReason`](../type-aliases/InterruptReason.md)\>

## Returns

`ReactElement`

## Example

```tsx
import { InterruptRenderer } from "@pgege/kaboo-react";
import type { InterruptReason } from "@pgege/kaboo-react";

const reason: InterruptReason = {
  type: "form",
  questions: [{ question: "Which market?", options: ["AI", "Cloud"] }],
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
