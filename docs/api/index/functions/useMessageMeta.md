[**@pgege/kaboo-react**](../../README.md)

***

# Function: useMessageMeta()

> **useMessageMeta**(): `Record`\<`string`, [`MessageMeta`](../interfaces/MessageMeta.md)\>

Defined in: [src/context/MessageMeta.tsx:33](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/MessageMeta.tsx#L33)

Read the per-message metadata map (timestamps and per-message references)
recovered from the run's event stream. Keys are message ids; entries exist
only for messages whose events carried metadata, so always handle absence.

## Returns

`Record`\<`string`, [`MessageMeta`](../interfaces/MessageMeta.md)\>

## Example

```tsx
import { useMessageMeta } from "@pgege/kaboo-react";

function SentAt({ messageId }: { messageId: string }) {
  const meta = useMessageMeta()[messageId];
  return meta?.createdAt ? <time>{new Date(meta.createdAt).toLocaleTimeString()}</time> : null;
}
```
