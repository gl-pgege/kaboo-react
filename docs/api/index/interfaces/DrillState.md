[**kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [types.ts:196](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L196)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [types.ts:200](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L200)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [types.ts:202](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L202)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [types.ts:198](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L198)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [types.ts:208](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L208)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [types.ts:206](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L206)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [types.ts:204](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L204)

Pop the last group id, ascending one level.

#### Returns

`void`
