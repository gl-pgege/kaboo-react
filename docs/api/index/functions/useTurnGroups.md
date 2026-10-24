[**@pgege/kaboo-react**](../../README.md)

***

# Function: useTurnGroups()

> **useTurnGroups**(`messageId`): [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: [src/context/TurnBinding.tsx:82](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/TurnBinding.tsx#L82)

All activity groups of the turn anchored on `messageId` (the turn's final
assistant message), or an empty array for any other message. Lets custom
surfaces implement their own end-of-turn presentation from the same binding
the built-in `turnFooter` slot uses.

## Parameters

### messageId

`string` \| `undefined`

## Returns

[`GroupEntry`](../type-aliases/GroupEntry.md)[]

## Example

```tsx
import { useTurnGroups } from "@pgege/kaboo-react";

function TurnToolCount({ messageId }: { messageId: string }) {
  const groups = useTurnGroups(messageId);
  return <span>{groups.reduce((n, [, g]) => n + g.tools.length, 0)}</span>;
}
```
