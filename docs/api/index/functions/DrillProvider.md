[**@pgege/kaboo-react**](../../README.md)

***

# Function: DrillProvider()

> **DrillProvider**(`__namedParameters`): `Element`

Defined in: [src/context/DrillContext.tsx:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/DrillContext.tsx#L34)

Provides drill-down navigation state ([DrillState](../interfaces/DrillState.md)) to the activity
components below it. Included automatically by [KabooProvider](KabooProvider.md); only
mount it yourself if you compose the providers by hand.

## Parameters

### \_\_namedParameters

#### children

`ReactNode`

## Returns

`Element`

## Example

```tsx
import { DrillProvider, GlassTabs, DrillDetailView } from "@pgege/kaboo-react";

function Panel() {
  return (
    <DrillProvider>
      <GlassTabs />
      <DrillDetailView />
    </DrillProvider>
  );
}
```
