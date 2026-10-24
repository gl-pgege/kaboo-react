[**@pgege/kaboo-react**](../../README.md)

***

# Function: useKabooSend()

> **useKabooSend**(`agentId?`): (`content`, `options`) => `Promise`\<`string`\>

Defined in: [src/hooks/useKabooSend.ts:52](https://github.com/gl-pgege/kaboo-react/blob/main/src/hooks/useKabooSend.ts#L52)

Send a user message and run the agent through CopilotKit, the way
`<CopilotChat>` does: the run carries the app's frontend tools, context and
`properties`, and CopilotKit answers the tools it calls. Use it for every
way a message enters the conversation (the composer, a suggestion, an "Ask"
button) so they all behave alike.

A message sent while requests wait for the person skips them: each open
request gets the answer the person already gave it or a note that they
moved on, the agent takes those in, and then the message runs.

## Parameters

### agentId?

`string`

The agent to run; the provider's agent when omitted.

## Returns

`send(content, options?)`, resolving with the message id once the run (and any follow-up) ends.

(`content`, `options`) => `Promise`\<`string`\>

## Example

```tsx
import { useKabooSend } from "@pgege/kaboo-react";

function AskButton({ question }: { question: string }) {
  const send = useKabooSend();
  return <button onClick={() => void send(question)}>{question}</button>;
}
```
