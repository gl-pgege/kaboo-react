[**@pgege/kaboo-react**](../../README.md)

***

# Function: useRequestTool()

> **useRequestTool**\<`T`\>(`options`): `void`

Defined in: [src/requests/useRequestTool.tsx:147](https://github.com/gl-pgege/kaboo-react/blob/main/src/requests/useRequestTool.tsx#L147)

Register a browser tool the person answers: a question, a file request, a
pick from a list. It is a CopilotKit human-in-the-loop tool, offered to the
agents whose `client_tools` allow it, sub-agents included; their requests
appear in the main transcript.

kaboo-react checks each call's arguments against `parameters` and answers
a malformed call with the problems, so the agent can correct it. Requests
come up one at a time, in the order the agents asked; the ones waiting their
turn show as "Up next". Sending a new message skips the open ones (see
[useKabooSend](useKabooSend.md)).

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### options

[`KabooRequestToolOptions`](../interfaces/KabooRequestToolOptions.md)\<`T`\>

## Returns

`void`

## Example

```tsx
import { useRequestTool, toolSchema } from "@pgege/kaboo-react";

const parameters = toolSchema<{ reason: string }>(
  { type: "object", properties: { reason: { type: "string" } }, required: ["reason"] },
  (value) => (typeof (value as { reason?: unknown })?.reason === "string" ? [] : ["reason must be a string"]),
);

function FileRequests() {
  useRequestTool({
    name: "request_files",
    description: "Ask the person to upload files.",
    parameters,
    render: ({ args, status, answer, skip }) =>
      status === "waiting" ? (
        <UploadPanel reason={args.reason} onDone={(ids) => answer({ files: ids })} onSkip={skip} />
      ) : null,
  });
  return null;
}
```
