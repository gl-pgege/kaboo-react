# Human-in-the-loop

When a run pauses for the person, kaboo-react shows the request in the chat and
resumes the run with the answer. There are two built-in kinds of request, on the
same mechanism: a **question** the agent asks with `ask_user`, and a tool call
waiting for **approval**. Apps add their own kinds (a file picker, a data
source picker) with their own renderers.

A request waits with no time limit. The pause lives in the stored conversation,
so the person can close the tab, come back days later on another device, and
answer; if they send a message instead, the request is skipped.

## Questions

Questions are multiple choice, like Cursor's:

- Each question offers the agent's options, single or multi-select.
- Every question has an **Other** row with its own text field, so the person
  can always answer in their own words.
- **Submit** sends the answers once every question has one; **Skip** answers
  nothing. Several questions step through with Next and Back.

The answer is a `{question: answer}` map — a string, a list for multi-select,
the person's own words for Other — and the answered Q&A stays in the
transcript.

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

A tool that enforces its own approvals (kaboo-workflows'
`interrupt.tool_approvals`) raises the same approval request, so the same card
renders it. Its `reason.request` is the tool's own request ID; the card sends
the same answers, and the host forwards the decision to the tool's service.

## What each answer sends

| The person… | `onResolve` / `onCancel` | The agent |
|---|---|---|
| approves | `onResolve({ status: "approved", scope })` | runs the call |
| denies | `onResolve({ status: "cancelled", reason? })` | cancels it and reads the reason |
| answers questions | `onResolve({ "<question>": answer })` | reads the answers |
| skips or dismisses | `onCancel()` | cancels it as skipped |

A denial is sent as `cancelled` so an agent that predates denial reasons can
never mistake it for an approval.

## Moving on

If the person sends a message while a question or approval waits, what was
waiting is skipped and the agent answers the message. You do not need to block
the composer: the AG-UI client refuses to start a run while requests are open,
so the built-in handler drops the stale requests just before the new message's
run starts, and the agent closes them as skipped.

## Inline vs chat-slot placement

- If a request is anchored to a tool call that is still visible on screen, the
  prompt renders **inline at that tool's position**, in chronological order.
- Otherwise it renders in a fallback slot in the chat.

You don't configure this — it's automatic — but it's why prompts appear "in the
right place" rather than floating on top of the turn.

## The InterruptBridge

The bridge holds the open requests, and which of them were already answered, so
any surface can render or count them. `useInterruptFor(toolCallId)` finds the
request anchored to a tool call; `useInterruptBridge()` gives the whole set, for
example for a "waiting for you" badge:

```tsx
import { useInterruptBridge } from "@pgege/kaboo-react";

export function WaitingBadge() {
  const { active, answered } = useInterruptBridge();
  const waiting = active.filter((i) => !answered.has(i.id)).length;
  return waiting > 0 ? <span>{waiting} waiting for you</span> : null;
}
```

`InterruptBridgeProvider` and `InterruptBridgePublisher` are the lower-level
pieces; both are wired for you by `KabooProvider` + `KabooInterruptHandler`.

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

## Custom renderers

`interruptRenderers` replaces the UI for a request kind: the built-in `approval`
and `form`, or an app's own kind. A renderer receives `InterruptRendererProps`
(the `reason` plus `onResolve`/`onCancel`), typed with the reason it handles.

### A custom approval card that keeps the standard options

Render your own summary and reuse `ApprovalActions` (or `useApprovalDecision`
for your own buttons), so the scopes, deny reason, deadline and batch behaviour
stay standard:

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

Read questions with `toFormQuestion` (it also reads the shape older agents send)
and answer with `buildAnswerPayload`, so the agent and the answered Q&A card
receive the same answer as from the built-in card:

```tsx
import { useState } from "react";
import { buildAnswerPayload, toFormQuestion } from "@pgege/kaboo-react";
import type { FormReason, InterruptRendererProps } from "@pgege/kaboo-react";

export function ChipQuestions({ reason, onResolve, onCancel }: InterruptRendererProps<FormReason>) {
  const questions = reason.questions.map(toFormQuestion);
  const [answers, setAnswers] = useState<Record<number, string>>({});
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
      <button onClick={() => onResolve(buildAnswerPayload(questions, answers))}>Send</button>
      <button onClick={onCancel}>Skip</button>
    </div>
  );
}
```

### An app's own request kind

A tool that needs something other than an answer — a file, a data source —
raises its own kind (`type: "files"`), and the app registers a renderer for it.
Its fields arrive on `reason`. A kind with no registered renderer gets a minimal
card with its `message` and Skip, so the chat never stalls.

```tsx
import { KabooProvider } from "@pgege/kaboo-react";
import type { InterruptRendererProps } from "@pgege/kaboo-react";

interface FilesRequest {
  type: string;
  message?: string;
  accept?: string[];
}

function FilesPicker({ reason, onResolve, onCancel }: InterruptRendererProps<FilesRequest>) {
  return (
    <div>
      <p>{reason.message}</p>
      <input
        type="file"
        accept={reason.accept?.join(",")}
        onChange={(e) => onResolve({ files: [...(e.target.files ?? [])].map((f) => f.name) })}
      />
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
      interruptRenderers={{ files: FilesPicker }}
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
