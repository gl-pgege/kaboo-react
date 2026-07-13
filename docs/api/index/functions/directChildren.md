[**@pgege/kaboo-react**](../../README.md)

***

# Function: directChildren()

> **directChildren**(`groups`, `parentId`): [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: [src/utils/groups.ts:77](https://github.com/gl-pgege/kaboo-react/blob/main/src/utils/groups.ts#L77)

Direct children of `parentId` (one level deep) via the `parentGroup` field.

## Parameters

### groups

`Record`\<`string`, [`StreamGroup`](../interfaces/StreamGroup.md)\>

### parentId

`string`

## Returns

[`GroupEntry`](../type-aliases/GroupEntry.md)[]

## Example

```ts
import { directChildren } from "@pgege/kaboo-react";

function childCount(
  groups: Parameters<typeof directChildren>[0],
  parentId: string,
) {
  return directChildren(groups, parentId).length;
}
```
