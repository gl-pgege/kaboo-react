[**@pgege/kaboo-react**](../../README.md)

***

# Interface: MessageMeta

Defined in: [src/types.ts:240](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L240)

Durable per-message metadata, recovered from the run's event stream (the
`kaboo.message_meta` CUSTOM event emitted by kaboo-runtime and event
timestamps). Because it rides events — which persist verbatim and replay on
reconnect — it survives reloads, unlike session-only registries.

## Properties

### createdAt?

> `optional` **createdAt?**: `number`

Defined in: [src/types.ts:242](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L242)

Wall-clock time the message was accepted/streamed, epoch milliseconds.

***

### references?

> `optional` **references?**: `unknown`[]

Defined in: [src/types.ts:247](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L247)

References the message was sent with (`state.kaboo_references` at run
start), for rendering reference chips on replayed transcripts.

***

### runId?

> `optional` **runId?**: `string`

Defined in: [src/types.ts:255](https://github.com/gl-pgege/kaboo-react/blob/main/src/types.ts#L255)

The AG-UI run that produced this message, derived from the event stream
itself (the enclosing `RUN_STARTED` at the message's start event). Unlike
CopilotKit's session-only message-to-run registry, this survives thread
replay, where replayed messages would otherwise all be attributed to the
synthetic connect run.
