[**@pgege/kaboo-react**](../../README.md)

***

# Function: TurnFeedback()

> **TurnFeedback**(`__namedParameters`): `Element` \| `null`

Defined in: [src/feedback/TurnFeedback.tsx:45](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/TurnFeedback.tsx#L45)

A minimal thumbs up / thumbs down control for one turn, designed for the
[KabooSlots.turnFooter](../interfaces/KabooSlots.md#turnfooter) slot. Thumbs down opens an optional comment
box before submitting. All storage flows through the host's `onFeedback`.

## Parameters

### \_\_namedParameters

[`TurnFeedbackProps`](../interfaces/TurnFeedbackProps.md)

## Returns

`Element` \| `null`

## Example

```tsx
import { KabooProvider, TurnFeedback } from "@pgege/kaboo-react";

function slots() {
  return {
    turnFooter: (ctx: { groups: Parameters<typeof TurnFeedback>[0]["groups"] }) => (
      <TurnFeedback
        groups={ctx.groups}
        onFeedback={(p) =>
          fetch("/api/feedback", { method: "POST", body: JSON.stringify(p) })
        }
      />
    ),
  };
}
```
