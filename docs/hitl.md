# Human-in-the-loop

When a run pauses for human input, kaboo-react surfaces the prompt in the UI and
resumes the run once the user answers. This works for a single gate and for many
gates open at once.

## Interrupt model

An interrupt's `reason` is one of two shapes (`InterruptReason`):

- **`ApprovalReason`** — approve or reject a gated tool call (`type: "approval"`).
- **`FormReason`** — answer one or more questions (`type: "form"`).

Each open interrupt has a unique `id` and is resolved independently.

## The built-in handler

`KabooProvider` mounts `KabooInterruptHandler` for you. CopilotKit can surface
**several** open interrupts at once (e.g. two gated tools called in parallel); the
handler renders one card per interrupt and resolves each by its own `id`, so N
parallel gates never wedge.

## Inline vs chat-slot placement

- If an interrupt is anchored to a tool call that is still visible on screen, the
  prompt renders **inline at that tool's position**, in chronological order.
- Otherwise it renders in a fallback slot in the chat.

You don't configure this — it's automatic — but it's why prompts appear "in the
right place" rather than floating on top of the turn.

## The InterruptBridge

The bridge lets an owning agent card (and the drill-down view) render a prompt
inline. Use `useInterruptFor(toolCallId)` to find the open interrupt anchored to a
specific tool call:

```tsx
import { useInterruptFor } from "@kaboo/react";

function GateBadge({ toolCallId }: { toolCallId: string }) {
  const interrupt = useInterruptFor(toolCallId);
  return <span>{interrupt ? "Awaiting input" : "OK"}</span>;
}
```

`InterruptBridgeProvider` and `InterruptBridgePublisher` are the lower-level
pieces; both are wired for you by `KabooProvider` + `KabooInterruptHandler`.

## Custom renderers

Override the default approval/form UI per interrupt type via `interruptRenderers`.
A renderer receives `InterruptRendererProps` (the `reason` plus
`onResolve`/`onCancel`):

```tsx
import { KabooProvider, InterruptRenderer } from "@kaboo/react";
import type { InterruptRendererProps } from "@kaboo/react";

function MyApproval(props: InterruptRendererProps) {
  // Wrap or fully replace the default UI.
  return <InterruptRenderer {...props} />;
}

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider
      runtimeUrl="/api/copilotkit"
      agent={agent}
      threadId={threadId}
      interruptRenderers={{ approval: MyApproval }}
    >
      <div />
    </KabooProvider>
  );
}
```
