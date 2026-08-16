[**@pgege/kaboo-react**](../../README.md)

***

# Interface: TurnFeedbackState

Defined in: [src/feedback/useTurnFeedback.ts:32](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L32)

What [useTurnFeedback](../functions/useTurnFeedback.md) returns.

## Properties

### submit

> **submit**: (`value`, `comment?`) => `Promise`\<`void`\>

Defined in: [src/feedback/useTurnFeedback.ts:41](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L41)

Submit a score for the turn. Resolves the turn's `traceId` / `runId` /
`turnId` from its activity groups and invokes the host's `onFeedback`.

#### Parameters

##### value

`0` \| `1`

##### comment?

`string`

#### Returns

`Promise`\<`void`\>

***

### submitted?

> `optional` **submitted?**: `0` \| `1`

Defined in: [src/feedback/useTurnFeedback.ts:34](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L34)

The score the user already submitted for this turn, if any.

***

### submitting

> **submitting**: `boolean`

Defined in: [src/feedback/useTurnFeedback.ts:36](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L36)

Whether a submission is currently in flight.

***

### traceId?

> `optional` **traceId?**: `string`

Defined in: [src/feedback/useTurnFeedback.ts:47](https://github.com/gl-pgege/kaboo-react/blob/main/src/feedback/useTurnFeedback.ts#L47)

The turn's resolved trace id, if the service ran with telemetry enabled.
Hosts can use its absence to hide feedback UI when scores would have
nothing to attach to.
