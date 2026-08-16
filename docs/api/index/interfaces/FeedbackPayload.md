[**@pgege/kaboo-react**](../../README.md)

***

# Interface: FeedbackPayload

Defined in: [src/feedback/useTurnFeedback.ts:11](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L11)

The payload handed to a host's `onFeedback` callback when the user scores a
turn. kaboo-react has no storage opinion: the host forwards this wherever it
evaluates runs (typically its backend, which posts a score to an
observability platform by `traceId`).

## Properties

### comment?

> `optional` **comment?**: `string`

Defined in: [src/feedback/useTurnFeedback.ts:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L15)

Optional free-text comment accompanying the score.

***

### runId?

> `optional` **runId?**: `string`

Defined in: [src/feedback/useTurnFeedback.ts:23](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L23)

AG-UI run id of the turn's (first) run, when known.

***

### traceId?

> `optional` **traceId?**: `string`

Defined in: [src/feedback/useTurnFeedback.ts:21](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L21)

OpenTelemetry trace id of the turn's root run, when the workflow service
ran with telemetry enabled. The key for attaching the score to the exact
trace in the host's observability backend.

***

### turnId?

> `optional` **turnId?**: `string`

Defined in: [src/feedback/useTurnFeedback.ts:25](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L25)

kaboo's logical turn id (stable across interrupt/resume), when known.

***

### value

> **value**: `0` \| `1`

Defined in: [src/feedback/useTurnFeedback.ts:13](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L13)

`1` for positive feedback (thumbs up), `0` for negative (thumbs down).
