[**@pgege/kaboo-react**](../../README.md)

***

# Function: timelineToolUseId()

> **timelineToolUseId**(`entry`): `string` \| `undefined`

Defined in: [src/utils/timeline.ts:11](https://github.com/gl-pgege/kaboo-react/blob/main/src/utils/timeline.ts#L11)

The tool-call id of a timeline tool entry, from either shape it may arrive in.

The producer emits `toolUseId` and keeps the tool itself once in the group's
`tools`. Snapshots written before that change embedded the whole `ToolCall`
in the entry instead, and threads persisted then still replay, so both are
read.

## Parameters

### entry

[`TimelineEntry`](../type-aliases/TimelineEntry.md)

## Returns

`string` \| `undefined`
