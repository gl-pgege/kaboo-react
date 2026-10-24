[**@pgege/kaboo-react**](../../README.md)

***

# Function: useAskUserTool()

> **useAskUserTool**(`options?`): `void`

Defined in: [src/requests/useAskUserTool.tsx:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useAskUserTool.tsx#L56)

Register `ask_user`, the question tool: an agent whose `client_tools` allow
it asks the person short questions and waits for the answers, which come
back as JSON keyed by question.

## Parameters

### options?

[`UseAskUserToolOptions`](../interfaces/UseAskUserToolOptions.md) = `{}`

## Returns

`void`

## Example

```tsx
import { useAskUserTool } from "@pgege/kaboo-react";
import { KabooChat } from "@pgege/kaboo-react/copilotkit";

function Chat() {
  useAskUserTool();
  return <KabooChat />;
}
```
