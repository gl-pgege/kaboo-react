[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:369](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L369)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:373](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L373)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:375](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L375)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:371](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L371)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:381](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L381)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:379](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L379)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:377](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L377)

Pop the last group id, ascending one level.

#### Returns

`void`
