[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: ApprovalDecision

> **ApprovalDecision** = \{ `scope?`: [`ApprovalScope`](ApprovalScope.md); `status`: `"approved"`; `tool_input?`: `unknown`; \} \| \{ `reason?`: `string`; `status`: `"cancelled"`; \}

Defined in: [src/types.ts:116](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L116)

The answer an approval card sends back. An approval runs the call (with an
optional edit and how far it reaches); a denial is sent as `cancelled`, so an
agent that predates denial reasons can never mistake it for approval.

## Union Members

### Type Literal

\{ `scope?`: [`ApprovalScope`](ApprovalScope.md); `status`: `"approved"`; `tool_input?`: `unknown`; \}

#### scope?

> `optional` **scope?**: [`ApprovalScope`](ApprovalScope.md)

How far the approval reaches; `once` when absent.

#### status

> **status**: `"approved"`

Run the call.

#### tool\_input?

> `optional` **tool\_input?**: `unknown`

The person's edit of the call's input.

***

### Type Literal

\{ `reason?`: `string`; `status`: `"cancelled"`; \}

#### reason?

> `optional` **reason?**: `string`

The person's reason, handed to the agent.

#### status

> **status**: `"cancelled"`

Do not run the call.
