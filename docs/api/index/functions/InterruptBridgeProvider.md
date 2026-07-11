[**kaboo-react**](../../README.md)

***

# Function: InterruptBridgeProvider()

> **InterruptBridgeProvider**(`__namedParameters`): `Element`

Defined in: [context/InterruptBridge.tsx:64](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/context/InterruptBridge.tsx#L64)

Holds the set of currently open interrupts so any tool row can claim and
render its own gate inline (see [useInterruptFor](useInterruptFor.md)). Included
automatically by [KabooProvider](KabooProvider.md).

## Parameters

### \_\_namedParameters

#### children

`ReactNode`

## Returns

`Element`

## Example

```tsx
import { InterruptBridgeProvider } from "kaboo-react";

function Providers({ children }: { children: React.ReactNode }) {
  return <InterruptBridgeProvider>{children}</InterruptBridgeProvider>;
}
```
