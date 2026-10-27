[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ToolOutcome

Defined in: [src/types.ts:341](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L341)

How a tool call ended, as the workflow service reported it.

## Properties

### error?

> `optional` **error?**: `string`

Defined in: [src/types.ts:345](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L345)

What went wrong, when it failed.

***

### fix?

> `optional` **fix?**: `string`

Defined in: [src/types.ts:347](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L347)

What to do about it, when the tool said.

***

### status

> **status**: `"success"` \| `"error"`

Defined in: [src/types.ts:343](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L343)

`"error"` when the call failed.
