[**@pgege/kaboo-react**](../../README.md)

***

# Interface: DrillState

Defined in: [src/types.ts:293](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L293)

Drill-down navigation state: the current path into the activity tree plus the
actions to move through it. Exposed by [useDrill](../functions/useDrill.md).

## Properties

### activeDrill

> **activeDrill**: `string` \| `null`

Defined in: [src/types.ts:297](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L297)

The deepest group id in the path, or `null` at the root.

***

### drillIn

> **drillIn**: (`groupId`) => `void`

Defined in: [src/types.ts:299](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L299)

Push a group id, descending one level.

#### Parameters

##### groupId

`string`

#### Returns

`void`

***

### drillPath

> **drillPath**: `string`[]

Defined in: [src/types.ts:295](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L295)

Group ids from root to the current level.

***

### drillToLevel

> **drillToLevel**: (`level`) => `void`

Defined in: [src/types.ts:305](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L305)

Trim the path to `level` (0-based), jumping to a breadcrumb.

#### Parameters

##### level

`number`

#### Returns

`void`

***

### drillToRoot

> **drillToRoot**: () => `void`

Defined in: [src/types.ts:303](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L303)

Clear the path, returning to the root.

#### Returns

`void`

***

### drillUp

> **drillUp**: () => `void`

Defined in: [src/types.ts:301](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L301)

Pop the last group id, ascending one level.

#### Returns

`void`
