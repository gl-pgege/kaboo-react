[**@pgege/kaboo-react**](../../README.md)

***

# Interface: LiveToolCall

Defined in: [src/hooks/canvas.ts:33](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L33)

A tool call still running, with its arguments as far as they have streamed.

## Properties

### agentName

> **agentName**: `string`

Defined in: [src/hooks/canvas.ts:43](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L43)

The name of the agent making the call.

***

### args

> **args**: `unknown`

Defined in: [src/hooks/canvas.ts:39](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L39)

The arguments parsed so far; partial while the model is still writing them.

***

### subagentRunId

> **subagentRunId**: `string`

Defined in: [src/hooks/canvas.ts:41](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L41)

The sub-agent making the call.

***

### toolCallId

> **toolCallId**: `string`

Defined in: [src/hooks/canvas.ts:35](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L35)

The call's id.

***

### toolName

> **toolName**: `string`

Defined in: [src/hooks/canvas.ts:37](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/canvas.ts#L37)

The tool's name.
