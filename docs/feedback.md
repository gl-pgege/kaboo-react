# Turn feedback

kaboo-react ships a small, storage-free feedback mechanism for scoring turns:
a headless `useTurnFeedback` hook plus an optional `TurnFeedback` thumbs
up/down component. The library resolves *which* turn is being scored (its
`traceId` / `runId` / `turnId`) and hands the payload to a host callback —
where the score goes is entirely the host's decision, consistent with the
slots philosophy.

The typical pipeline: the workflow service runs with telemetry enabled, every
turn's trace id rides the activity stream into `StreamGroup.traceId` and
`ActivityState.traceByRun`, and the host forwards feedback to its
observability backend's score API (e.g. Langfuse `create_score`) keyed by that
trace id. See the kaboo-workflows evaluation guide for the service side.

## Drop-in component

`TurnFeedback` is designed for the `turnFooter` slot, so feedback renders
under each completed turn:

```tsx
import { KabooProvider, TurnFeedback, type TurnFooterContext } from "@pgege/kaboo-react";

const slots = {
  turnFooter: (ctx: TurnFooterContext) => (
    <TurnFeedback
      groups={ctx.groups}
      onFeedback={(p) =>
        fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        })
      }
    />
  ),
};

<KabooProvider slots={slots}>…</KabooProvider>;
```

Thumbs up submits immediately; thumbs down opens an optional "what went
wrong?" comment box first. After submission the control collapses into a
thank-you line for that turn.

### Props

| Prop | Type | Description |
| --- | --- | --- |
| `groups` | `GroupEntry[]` | The turn's activity groups (e.g. `TurnFooterContext.groups`). |
| `onFeedback` | `(payload: FeedbackPayload) => void \| Promise<void>` | Host sink for the score. May be async; the buttons disable while it's in flight. |
| `requireTrace` | `boolean` | Render nothing when the turn has no resolvable `traceId` (service ran without telemetry). Default `false`: feedback is still collected with `runId`/`turnId` correlation only. |
| `label` | `string` | Prompt next to the buttons. Default "Was this helpful?". |

### Payload

```ts
interface FeedbackPayload {
  value: 0 | 1;        // 1 = thumbs up, 0 = thumbs down
  comment?: string;    // free text, negative feedback only by default
  traceId?: string;    // OTel trace id of the turn's root run (telemetry on)
  runId?: string;      // AG-UI run id
  turnId?: string;     // kaboo's logical turn id
}
```

## Headless hook

Build any UI on top of `useTurnFeedback` — star ratings, inline surveys,
keyboard shortcuts:

```tsx
import { useTurnFeedback, type GroupEntry } from "@pgege/kaboo-react";

function Score({ groups }: { groups: GroupEntry[] }) {
  const { submit, submitted, submitting, traceId } = useTurnFeedback(
    groups,
    (p) => fetch("/api/feedback", { method: "POST", body: JSON.stringify(p) }),
  );
  if (submitted != null) return <span>Thanks!</span>;
  return (
    <button disabled={submitting} onClick={() => submit(1)}>
      Helpful{traceId ? "" : " (untraced)"}
    </button>
  );
}
```

The hook resolves the turn's ids with `resolveTurnIds(groups, traceByRun)`
(also exported): the run-level trace from `ActivityState.traceByRun` wins over
any group's own `traceId`, because nested agents may complete under their own
invocation traces.

## Host pattern

The host backend owns storage and authentication. A reference implementation
forwarding to Langfuse:

```ts
// POST /api/feedback  (authenticated like any other app endpoint)
import { Langfuse } from "langfuse";

const langfuse = new Langfuse(); // LANGFUSE_PUBLIC_KEY / SECRET_KEY / BASEURL

app.post("/api/feedback", async (req, res) => {
  const { traceId, value, comment, runId, turnId } = req.body;
  if (traceId) {
    langfuse.score({
      traceId,
      name: "user-feedback",
      value,
      comment: comment || undefined,
    });
    await langfuse.flushAsync();
  }
  // else: persist {runId, turnId, value, comment} however you like
  res.sendStatus(204);
});
```

Scores land on the exact trace of the run the user judged, next to its token
usage, cost, and tool spans — negative feedback becomes a review queue, and
reviewed items graduate into your golden eval dataset.

## Styling

The component uses `kaboo-feedback*` class names (`kaboo-feedback`,
`kaboo-feedback-label`, `kaboo-feedback-btn`, `kaboo-feedback-btn-active`,
`kaboo-feedback-comment`, `kaboo-feedback-input`, `kaboo-feedback-done`) and
inherits the kaboo theme variables, so it follows your existing theming
overrides.
