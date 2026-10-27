[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:387](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L387)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:391](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L391)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:393](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L393)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:389](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L389)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:399](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L399)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:397](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L397)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:395](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L395)

Pop the last group id, ascending one level.

#### Returns

`void`
