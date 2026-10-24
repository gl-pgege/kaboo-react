[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:352](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L352)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:356](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L356)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:358](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L358)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:354](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L354)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:364](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L364)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:362](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L362)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:360](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L360)

Pop the last group id, ascending one level.

#### Returns

`void`
