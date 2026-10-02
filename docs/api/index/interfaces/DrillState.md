[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:294](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L294)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:298](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L298)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:300](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L300)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:296](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L296)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:306](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L306)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:304](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L304)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:302](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L302)

Pop the last group id, ascending one level.

#### Returns

`void`
