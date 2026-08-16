[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TurnFeedbackProps

Defined in: [src/feedback/TurnFeedback.tsx:6](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/TurnFeedback.tsx#L6)

Props for [TurnFeedback](../functions/TurnFeedback.md).

## Properties

### groups

> **groups**: [`GroupEntry`](../type-aliases/GroupEntry.md)[]

Defined in: [src/feedback/TurnFeedback.tsx:8](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/TurnFeedback.tsx#L8)

The turn's activity groups (e.g. `TurnFooterContext.groups`).

***

### label?

> `optional` **label?**: `string`

Defined in: [src/feedback/TurnFeedback.tsx:19](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/TurnFeedback.tsx#L19)

Prompt shown next to the buttons. Defaults to "Was this helpful?".

***

### onFeedback

> **onFeedback**: [`FeedbackHandler`](../type-aliases/FeedbackHandler.md)

Defined in: [src/feedback/TurnFeedback.tsx:10](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/TurnFeedback.tsx#L10)

Host sink for the score — kaboo-react stores nothing itself.

***

### requireTrace?

> `optional` **requireTrace?**: `boolean`

Defined in: [src/feedback/TurnFeedback.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/TurnFeedback.tsx#L17)

Render nothing when the turn has no resolvable `traceId` (i.e. the
workflow service ran without telemetry, so a score would have nothing to
attach to). Defaults to `false`: feedback is still collected with
`runId`/`turnId` correlation only.
