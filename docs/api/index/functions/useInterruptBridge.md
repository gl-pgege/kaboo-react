[**@pgege/kaboo-react**](../../README.md)

***

# Function: useInterruptBridge()

> **useInterruptBridge**(): `object`

Defined in: [src/context/InterruptBridge.tsx:121](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptBridge.tsx#L121)

Reads the InterruptBridge: the list of open interrupts plus `publish`, and
which of them were already answered. Most consumers want
[useInterruptFor](useInterruptFor.md) instead; use this to inspect or drive the whole set —
for example a "waiting for you" badge counting open questions and approvals.

## Returns

### active

> **active**: [`ActiveInterrupt`](../interfaces/ActiveInterrupt.md)[]

Every open interrupt from the current run, in emission order.

### answered

> **answered**: `ReadonlySet`\<`string`\>

Ids of open interrupts already answered while the run waits on the rest.

### clearAnswered

> **clearAnswered**: () => `void`

Forget every recorded answer, so the open interrupts can be answered again.
`KabooInterruptHandler` calls it when an answer couldn't be recorded.

#### Returns

`void`

### failure

> **failure**: `string` \| `null`

Why the last answers never reached the agent, while the requests wait to
be answered again; `null` otherwise. Cleared when the person answers or
sends a message.

### markAnswered

> **markAnswered**: (`id`) => `void`

Record that an open interrupt was answered.

#### Parameters

##### id

`string`

#### Returns

`void`

### publish

> **publish**: (`interrupts`) => `void`

Replace the set of interrupts published to the bridge.

#### Parameters

##### interrupts

[`ActiveInterrupt`](../interfaces/ActiveInterrupt.md)[]

#### Returns

`void`

### setFailure

> **setFailure**: (`message`) => `void`

Record why answers never reached the agent, or clear it with `null`.

#### Parameters

##### message

`string` \| `null`

#### Returns

`void`

## Example

```tsx
import { useInterruptBridge } from "@pgege/kaboo-react";

function WaitingBadge() {
  const { active, answered } = useInterruptBridge();
  const waiting = active.filter((i) => !answered.has(i.id)).length;
  return waiting > 0 ? <span>{waiting} waiting for you</span> : null;
}
```
