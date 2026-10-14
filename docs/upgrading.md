# Upgrading

What changes between releases that you might have to act on, with the code
before and after. If none of a release's items apply to you, upgrading is a
version bump.

The kaboo libraries can be upgraded in any order: this release reads what older
agents send, and nothing it sends can be mistaken for an approval by an older
agent. Features that span the stack light up once every piece is upgraded — see
[Upgrading the stack](https://gl-pgege.github.io/kaboo-docs/start-here/#upgrading-the-stack).

## 0.10

### The built-in question card replaces custom clarification panels

**Who:** apps that register their own `form` renderer to get a Cursor-style
question card — kaboo and kaboo-bmo route `ask_user` to a `ClarificationPanel`.

The built-in card is now that card: the agent's options, single or
multi-select, an **Other** row with a text field on every question, Submit and
Skip. Delete the custom panel and style the built-in one with the theme tokens
and class names ([Theming](theming.md#questions-and-approvals)).

```diff
- function KabooFormInterrupt(props: InterruptRendererProps) {
-   // ...file and datasource branches...
-   return (
-     <ClarificationPanel
-       questions={toClarificationQuestions(props.reason)}
-       onSubmit={(answers) => props.onResolve(answersToPayload(props.reason, answers))}
-     />
-   );
- }
- const interruptRenderers = { form: KabooFormInterrupt }
+ // No form renderer: the built-in question card handles ask_user.
```

There is no free-text box any more. A question from an agent before
kaboo-workflows 0.27 with no options is answered through Other alone; one with
`type: "checkbox"` is multi-select.

### Custom request kinds replace `kaboo_kind`

**Who:** apps whose tools disguise a file or data source picker as a text
question with a discriminator (`kind`, `kaboo_kind`) and route it from a `form`
renderer.

Register a renderer per kind instead. The tool raises `type: "files"` (see the
kaboo-workflows [upgrade guide](https://gl-pgege.github.io/kaboo-workflows/upgrading/)),
and its fields arrive on `reason`.

```diff
- if (reason.kaboo_kind === "files") {
-   return <FilePanel context={reason.questions[0]?.question ?? ""} onSubmit={props.onResolve} />;
- }
+ interruptRenderers={{ files: FilesRenderer, datasources: DatasourcesRenderer }}
```

```tsx
import { KabooProvider, type InterruptRendererProps } from "@pgege/kaboo-react";

interface FilesRequest {
  type: string;
  message?: string;
  accept?: string[];
}

function FilesRenderer({ reason, onResolve, onCancel }: InterruptRendererProps<FilesRequest>) {
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

export function Chat({ threadId }: { threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent="kaboo"
      threadId={threadId}
      interruptRenderers={{ files: FilesRenderer }}
    >
      <div />
    </KabooProvider>
  );
}
```

A kind with no registered renderer gets a minimal card with its `message` and
Skip.

### The approval card offers more, and sends more

**Who:** everyone using the built-in approval card, and custom approval
renderers.

- **New options:** Allow for this chat and Always allow appear when the agent
  offers them (kaboo-workflows 0.27 with a host that remembers decisions, or a
  tool that enforces its own approvals); `approvalScopes` on `KabooProvider`
  narrows them for the app. "Applies to …" above them names what they cover
  (`reason.subject.label`).
- **Deny replaces Reject,** with an optional reason. It is sent through
  `onResolve({ status: "cancelled", reason })`, not `onCancel()`. `onCancel()`
  now means skip.
- **Approve sends a scope:** `{ status: "approved", scope: "once" }`.
- **Approve all / Deny all** appear with two or more approvals waiting.
- **Deadlines** are read from `reason.expiresAt` (the request's metadata); an
  expired card offers only Dismiss.
- **Tool-requested approvals** (kaboo-workflows' `interrupt.tool_approvals`)
  render on the same card; `reason.request` carries the tool's request ID for
  the host, and the card needs no change.

Custom approval cards keep these by rendering `ApprovalActions` or using
`useApprovalDecision`:

```diff
  function MyApproval(props: InterruptRendererProps) {
-   return <button onClick={() => props.onResolve({ status: "approved" })}>OK</button>;
+   return <ApprovalActions {...(props as InterruptRendererProps<ApprovalReason>)} />;
  }
```

### Sending a message skips what is waiting

**Who:** everyone; no code change.

Before, a message sent while a question or approval was open was refused by the
AG-UI client and silently lost. Now the handler drops the stale requests just
before the run starts, and the agent closes them as skipped and answers the
message. Remove any composer workaround that blocked sending.

### Types

- `FormQuestion` is `{ question, options, multiple? }`; `type` is deprecated
  and read only when `multiple` is absent. `toFormQuestion` reads either shape.
- `InterruptRendererProps<R>` takes the reason it handles; it defaults to the
  built-in kinds.
- `InterruptRenderers` (and `interruptRenderers`) is keyed by any request kind.
- `ApprovalReason` gains `subject`, `scopes`, `expiresAt` and `request`;
  `ApprovalDecision`, `ApprovalScope`, `ApprovalSubject` and
  `CustomRequestReason` are new.
- `useInterruptBridge()` adds `answered` and `markAnswered`.

### Wording

The answered Q&A card labels a question the person skipped "Skipped" (was
"Declined by user"). `isCancelledResult` recognises the agent's new notes
("Declined", "Skipped", "Expired", "The person skipped this question").
