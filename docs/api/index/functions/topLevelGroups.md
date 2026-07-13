[**@pgege/kaboo-react**](../../README.md)

***

# Function: topLevelGroups()

> **topLevelGroups**(`groups`): [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: [src/utils/groups.ts:56](https://github.com/gl-pgege/kaboo-react/blob/main/src/utils/groups.ts#L56)

Top-level groups are those without a parent. Uses the explicit
`parentGroup` field rather than parsing dot-paths out of the group id, so
group names are free to contain any characters.

## Parameters

### groups

`Record`\<`string`, [`StreamGroup`](../interfaces/StreamGroup.md)\>

## Returns

[`GroupEntry`](../type-aliases/GroupEntry.md)[]

## Example

```ts
import { topLevelGroups } from "@pgege/kaboo-react";

function rootCount(groups: Parameters<typeof topLevelGroups>[0]) {
  return topLevelGroups(groups).length;
}
```
