[**@pgege/kaboo-react**](../../README.md)

***

# Function: withReferenceState()

> **withReferenceState**(`state`, `objectReferences`): `Record`\<`string`, `unknown`\>

Defined in: src/references/serialize.ts:111

Merge object references into an existing AG-UI `state` under
[REFERENCES\_STATE\_KEY](../variables/REFERENCES_STATE_KEY.md). Returns a new object; empty input clears the key
so a prior turn's references never leak into the next run.

## Parameters

### state

`Record`\<`string`, `unknown`\> \| `undefined`

### objectReferences

[`SerializedObjectReference`](../interfaces/SerializedObjectReference.md)[]

## Returns

`Record`\<`string`, `unknown`\>
