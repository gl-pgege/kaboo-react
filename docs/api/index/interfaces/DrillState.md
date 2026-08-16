[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:276](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L276)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:280](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L280)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:282](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L282)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:278](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L278)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:288](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L288)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:286](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L286)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:284](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L284)

Pop the last group id, ascending one level.

#### Returns

`void`
