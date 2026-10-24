# Human-in-the-loop

When an agent needs the person, kaboo-react shows the request in the chat and
the agent carries on with the answer. There are two mechanisms:

- **Questions and requests** are tools the browser runs. `useAskUserTool`
  registers `ask_user`; `useRequestTool` registers any other request (a file,
  a data source) with your own panel. An agent calls them only when its
  workflow allows it (kaboo-workflows' `client_tools`), delegates included.
- **Approvals** pause the run on an interrupt, and the built-in
  `KabooInterruptHandler` draws the card on CopilotKit's `useInterrupt`. Apps
  add their own interrupt kinds with their own renderers.

A request waits with no time limit. The pause lives in the stored conversation,
so the person can close the tab, come back days later on another device, and
answer; if they send a message instead, the request is skipped.

## Questions

```tsx
import { useAskUserTool } from "@pgege/kaboo-react";
import { KabooChat } from "@pgege/kaboo-react/copilotkit";

export function Chat() {
  useAskUserTool();
  return <KabooChat />;
}
```

Questions are multiple choice, like Cursor's:

- Each question offers the agent's options, single or multi-select.
- Every question has an **Other** row with its own text field, so the person
  can always answer in their own words.
- **Submit** sends the answers once every question has one; **Skip** answers
  nothing. Several questions step through with Next and Back.

The answer is a `{question: answer}` map — a string, a list for multi-select,
the person's own words for Other — and the answered Q&A stays in the
transcript. A call whose arguments don't match the tool's schema is answered
with an error naming the problem, so the model asks again properly instead of
the person seeing a broken card.

## Requests

```tsx
import { toolSchema, useRequestTool, type KabooRequestRenderProps } from "@pgege/kaboo-react";

interface DatasourcesArgs {
  reason: string;
  kinds: string[];
}

const requestDatasources = toolSchema<DatasourcesArgs>(
  {
    type: "object",
    properties: { reason: { type: "string" }, kinds: { type: "array", items: { type: "string" } } },
    required: ["reason", "kinds"],
  },
  (value) => (Array.isArray((value as { kinds?: unknown })?.kinds) ? [] : ["kinds must be a list"]),
);

function DatasourcesPanel({ args, status, answer, skip }: KabooRequestRenderProps<DatasourcesArgs>) {
  if (status !== "waiting") return null;
  return (
    <div className="kaboo-interrupt">
      <p>{args.reason}</p>
      <button onClick={() => answer({ datasources: args.kinds })}>Use all</button>
      <button onClick={skip}>Skip</button>
    </div>
  );
}

export function BrowserTools() {
  useRequestTool({
    name: "request_datasources",
    description: "Ask the person to pick data sources and wait for the choice.",
    parameters: requestDatasources,
    render: DatasourcesPanel,
  });
  return null;
}
```

`parameters` takes any Standard Schema, such as a zod schema, or one built with
`toolSchema`. The panel gets the call's `args`, its `status`, and `answer` and
`skip`. An object passed to `answer` is sent as JSON; `skip` tells the agent the
person declined. Define the panel outside the component that registers it, so it
keeps its state.

## Several requests at once

One agent's questions show as one card that steps through them. When several
agents wait — parallel delegates asking at once — their requests show one at a
time, in the order they were asked, and the next waits under "Up next" until the
one above is answered. A delegate's request shows in the main transcript,
labelled with the agent, while it waits; once answered, the Q&A stays in that
agent's card.

## Approvals

The approval card shows what the agent wants to run (with its input under "View
input") and the options the request offers:

- **Approve** runs the call once.
- **Allow for this chat** and **Always allow** appear when the agent offers
  them — which it does only when the host remembers decisions (kaboo-runtime
  with a grant store), or when a tool that enforces its own approvals offers
  them. Above the buttons, "Applies to …" names what they cover (the request's
  `subject.label`, such as "catalog changes in Summit Outfitters"). Either
  also approves the other waiting requests with the same subject.
- **Deny** asks for an optional reason the agent will read.
- With a deadline, the card shows how long it stays answerable; once it has
  passed, only **Dismiss** remains.

With two or more approvals waiting, **Approve all** and **Deny all** appear.
A delegate's approval shows at its real tool row, labelled with the agent.

A tool that enforces its own approvals (kaboo-workflows'
`interrupt.tool_approvals`) raises the same approval request, so the same card
renders it. Its `reason.request` is the tool's own request ID; the card sends
the same answers, and the host forwards the decision to the tool's service.

## What each answer sends

| The person… | `onResolve` / `onCancel` | The agent |
|---|---|---|
| approves | `onResolve({ status: "approved", scope })` | runs the call |
| denies | `onResolve({ status: "cancelled", reason? })` | cancels it and reads the reason |
| skips or dismisses | `onCancel()` | cancels it as skipped |

A denial is sent as `cancelled` so an agent that predates denial reasons can
never mistake it for an approval.

The answers resume the turn in a new run, and the chat still shows one turn:
the `turnFooter` slot renders after the turn's last reply, and its `runIds`
list every run the turn spanned, so anything your app keys by run (files or
versions the turn made) is found under one of them.

## Moving on

If the person sends a message while a question, request or approval waits, what
was waiting is skipped and the agent answers the message. You do not need to
block the composer: sending through `KabooChat` or `useKabooSend` answers each
open request with "Skipped: the person sent a message instead of answering" and
cancels each open approval in the same run as the new message.

## When an answer can't be recorded

Sometimes answers never reach the agent: the host refuses a decision (its
approval service is down, or doesn't take it), or the request itself fails. The
requests are still open on the server, so the built-in handler brings them back
to be answered again, with the reason above them. Pass `onInterruptError` to
show the reason somewhere else too, such as a toast:

```tsx
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooProvider } from "@pgege/kaboo-react";

declare function showToast(message: string): void;

export function Chat({ threadId }: { threadId: string }) {
  return (
    <KabooProvider runtimeUrl="/api/copilotkit" agent="assistant" threadId={threadId} onInterruptError={showToast}>
      <CopilotChat />
    </KabooProvider>
  );
}
```

The reason is the message of the run's `RUN_ERROR`, which kaboo-runtime takes
from the error the host's `onDecision` throws, so the host should throw one a
person can act on. A run that fails after the agent started working is left to
the chat's usual error handling.

## Choosing the approval options

`approvalScopes` on `KabooProvider` narrows what the approval card offers for
the whole app. A request offers only the scopes both the agent and the app
allow; Approve (`once`) is always offered.

```tsx
import { KabooProvider } from "@pgege/kaboo-react";

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      approvalScopes={["once", "thread"]}
    >
      <div />
    </KabooProvider>
  );
}
```

## Styling

The built-in cards read the theme tokens and use a stable set of class names, so
most apps restyle them rather than replace them — see
[Theming](theming.md#questions-and-approvals).

## Custom cards

### A custom approval card that keeps the standard options

`interruptRenderers` replaces the UI for an interrupt kind: the built-in
`approval`, or an app's own kind. Render your own summary and reuse
`ApprovalActions` (or `useApprovalDecision` for your own buttons), so the
scopes, deny reason, deadline and batch behaviour stay standard:

```tsx
import { ApprovalActions, KabooProvider } from "@pgege/kaboo-react";
import type { ApprovalReason, InterruptRendererProps } from "@pgege/kaboo-react";

function ChangeCard(props: InterruptRendererProps<ApprovalReason>) {
  return (
    <div className="kaboo-interrupt">
      <p>{props.reason.subject?.label ?? props.reason.tool_name}</p>
      <ApprovalActions {...props} />
    </div>
  );
}

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      interruptRenderers={{ approval: ChangeCard }}
    >
      <div />
    </KabooProvider>
  );
}
```

### A custom question card

Pass `render` to `useAskUserTool`. Read questions with `toFormQuestion` and
answer with `buildAnswerPayload`, so the agent and the answered Q&A card
receive the same answer as from the built-in card:

```tsx
import { useState } from "react";
import { buildAnswerPayload, toFormQuestion, useAskUserTool } from "@pgege/kaboo-react";
import type { AskUserArgs, KabooRequestRenderProps } from "@pgege/kaboo-react";

function ChipQuestions({ args, status, answer, skip }: KabooRequestRenderProps<AskUserArgs>) {
  const questions = args.questions.map(toFormQuestion);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  if (status !== "waiting") return null;
  return (
    <div>
      {questions.map((q, idx) => (
        <fieldset key={q.question}>
          <legend>{q.question}</legend>
          {q.options.map((option) => (
            <button key={option} onClick={() => setAnswers({ ...answers, [idx]: option })}>
              {option}
            </button>
          ))}
        </fieldset>
      ))}
      <button onClick={() => answer(buildAnswerPayload(questions, answers))}>Send</button>
      <button onClick={skip}>Skip</button>
    </div>
  );
}

export function Questions() {
  useAskUserTool({ render: ChipQuestions });
  return null;
}
```

### An app's own interrupt kind

A server tool that needs something only the server can check raises its own
interrupt kind (`type: "account"`), and the app registers a renderer for it.
Its fields arrive on `reason`. A kind with no registered renderer gets a minimal
card with its `message` and Skip, so the chat never stalls. Prefer a browser
request (`useRequestTool`) when the server needs nothing but the answer.

```tsx
import { KabooProvider } from "@pgege/kaboo-react";
import type { InterruptRendererProps } from "@pgege/kaboo-react";

interface AccountRequest {
  type: string;
  message?: string;
  accounts?: string[];
}

function AccountPicker({ reason, onResolve, onCancel }: InterruptRendererProps<AccountRequest>) {
  return (
    <div>
      <p>{reason.message}</p>
      {(reason.accounts ?? []).map((account) => (
        <button key={account} onClick={() => onResolve({ account })}>
          {account}
        </button>
      ))}
      <button onClick={onCancel}>Skip</button>
    </div>
  );
}

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      interruptRenderers={{ account: AccountPicker }}
    >
      <div />
    </KabooProvider>
  );
}
```

## Remembered permissions

When the person chooses "Always allow", the host remembers it (kaboo-runtime's
`runner.listGrants` / `revokeGrant`). `PermissionList` renders the list with a
Revoke button each; your app loads and revokes through its own API:

```tsx
import { PermissionList, type RememberedPermission } from "@pgege/kaboo-react";

export function AssistantPermissions({
  grants,
  revoke,
}: {
  grants: RememberedPermission[];
  revoke: (id: string) => void;
}) {
  return <PermissionList grants={grants} onRevoke={revoke} />;
}
```

Lab scenarios:
[question-several](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/question-several.yaml),
[question-parallel](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/question-parallel.yaml),
[request-datasources](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/request-datasources.yaml),
[approval-subagent](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/approval-subagent.yaml)
and
[approval-grant](https://github.com/gl-pgege/kaboo-docs/blob/main/examples/kaboo-workflows-demo/scenarios/approval-grant.yaml).
