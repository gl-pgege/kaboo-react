[**kaboo-react**](../../README.md)

***

# Function: directChildren()

> **directChildren**(`groups`, `parentId`): [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: [utils/groups.ts:77](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/utils/groups.ts#L77)

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
import { directChildren } from "kaboo-react";

function childCount(
  groups: Parameters<typeof directChildren>[0],
  parentId: string,
) {
  return directChildren(groups, parentId).length;
}
```
