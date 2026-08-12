[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:262](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L262)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:266](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L266)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:268](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L268)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:264](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L264)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:274](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L274)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:272](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L272)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:270](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L270)

Pop the last group id, ascending one level.

#### Returns

`void`
