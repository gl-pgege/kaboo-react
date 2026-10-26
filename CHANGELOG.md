# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.1]

### Fixed

- **An agent card that mounts already finished starts collapsed**, as a card
  that finishes while you watch already did: a replayed thread, or a card
  inside a section the app keeps closed, no longer opens every finished agent
  with its whole task. A card that captured an `ask_user` answer, or whose
  agent failed, still opens.

## [0.13.0]

### Added

- **`useToolCallMeta()`** gives a tool renderer drawn inside an agent's
  timeline its call's `status` (`running`, `success`, `error` or `cancelled`),
  `label`, `error`, `fix`, `startedAt`, `endedAt`, `toolCallId` and
  `agentName`, and `null` outside a timeline. It wraps every renderer the
  timeline draws: CopilotKit's registered renderers, `toolRenderers` and the
  fallback. A renderer registered with CopilotKit now gets an errored or
  cancelled call as complete, so it stops spinning, and reads the real status
  from the hook.
- **Tool errors from kaboo-workflows 0.32.** A `TOOL_CALL_RESULT` whose
  `metadata.status` is `error` marks the call failed and keeps
  `metadata.error` and `metadata.fix` on `ToolCall.error` and `ToolCall.fix`;
  `metadata.label` relabels the call. Calls record `startedAt` and `endedAt`
  from the events' timestamps, and a failed sub-agent keeps its message on
  `StreamGroup.error`.
- **`KabooProvider` takes `markdownRenderer`**, which replaces the markdown
  renderer wherever agent text is drawn; **`renderAgentResult`**, which
  replaces a card's result area and also draws in the drill-in view;
  **`fallbackToolRenderer`**, which replaces the built-in tool row for tools
  without a renderer, in agent timelines and in the chat; and
  **`isReadOnlyTool`**, which folds two or more consecutive reads in an agent's
  timeline into one row ("Reading 3 items", "Read 3 items, 1 failed") that
  expands to the calls. `ToolRenderersProvider` takes the same four.
- **`ToolRow` takes an `icon`**, `MiniTable` a `truncated` count, and
  `Timeline` an `agentName`.

### Changed

- **Agent text renders as GitHub-flavored markdown** with Streamdown, the
  renderer CopilotKit's chat uses, so tables, numbered lists, code and links
  render, and text that is still streaming never shows an unclosed `**`.
  `streamdown` is now a dependency, on the `^1.3.0` range CopilotKit itself
  installs. Its output is styled by `styles.css` with the `--kaboo-*` tokens.
- **A card's task reads as text.** A JSON handoff shows the first of its
  `input`, `task`, `question`, `narrative`, `brief`, `request` or `message`
  (or else its short fields), rendered as markdown and clamped to three lines
  while the card is collapsed.
- **A failed agent shows its error** under the card's header in the error
  colour, and its badge says error instead of done. `--kaboo-error-bg` is a new
  token for that background.
- **The tool row is one compact line**: icon, label, target, a status icon
  (spinner, check, cross or cancelled) and how long the call took, expanding to
  the error and its fix, the input and the result. Its header is a button, the
  status icon classes (`.kaboo-tool-dot-*`) now set `color` instead of `fill`,
  and a finished call shows a check instead of the word "done".
- **Tables find rows under `untrusted_content.rows`**, with `columns` from
  either level, never show `_truncated` keys, and count `_truncated` rows in
  their "+N more". A list kaboo-workflows 0.32 cut
  (`{"items": [...], "_truncated": {"items": N}}`) draws as its table.

## [0.12.1]

### Fixed

- **A sent message renders in CopilotKit's own message and bubble.** To place
  its reference chips around the bubble, the user message copied CopilotKit's
  classes, and the copy had fallen behind CopilotKit's own. It now fills
  CopilotKit's bubble slot, so it follows CopilotKit's styling.

### Removed

- **`fast-json-patch`**, which nothing has imported since 0.12.0.

## [0.12.0]

See [Upgrading](docs/upgrading.md#012).

### Changed

- **Cards come from AG-UI's `SUBAGENT_*` events** and the events tagged with
  their `subagentRunId`, folded the same way live and on replay. The entry agent
  has no group.
- **Approvals render on CopilotKit's `useInterrupt`.**
- **The turn footer renders for every turn**, with every run since the person's
  message, including a turn answered without delegating.
- **Needs CopilotKit 1.79.1 or later.**

### Added

- **`useAskUserTool` and `useRequestTool`** register the browser's question and
  request tools, check calls against their schema, and show several requests in
  order.
- **`KabooChat` and `useKabooSend`**: a new message skips any open request.
- **`useAgentState`, `useLiveToolCalls` and `useAgentPresence`** for canvases.
- **`withSubagentLabel`** for sub-agents' generative UI surfaces.
- **`KabooProvider` passes `properties`, `renderToolCalls`,
  `renderActivityMessages`, `a2ui` and `openGenerativeUI`** to CopilotKit.
- **Tool renderers registered with CopilotKit draw inside sub-agent cards.**
- **Tool labels, structured outputs' schema names, run usage and trace ids**
  are read from kaboo-workflows 0.29's events.
- **`toolSchema` and `checkArguments`**, with their schema types, for browser
  tools described without a schema library.

### Removed

- **`KabooAskUser`**, the InterruptBridge (`InterruptBridgeProvider`,
  `InterruptBridgePublisher`, `useInterruptBridge`, `useInterruptFor`),
  `applyActivityPatch`, `StreamGroup.tokens`, embedded timeline tools, the
  continuation resolver, and pre-0.27 question shapes.

### Fixed

- **The CommonJS build has its own type declarations**, so `require` consumers
  type-check.

## [0.11.3]

### Fixed

- **A question or approval a delegate waits on shows under its card.** A
  delegate forwards what it waits on to its caller, anchored at the delegating
  call, which the chat draws as the delegate's card rather than a tool row. With
  kaboo-workflows 0.28.3, which tracks a coordinator's own tool calls, nothing
  drew the request, and the run sat waiting. The delegate's card now draws it,
  and so does the drill-in view of that delegate.

## [0.11.2]

See [Upgrading](docs/upgrading.md#0112).

### Added

- **`onInterruptError`** on `KabooProvider` and `KabooInterruptHandler`, called
  with the reason when a person's answers never reached the agent.
- **`useInterruptBridge()` gives `failure`, `setFailure` and `clearAnswered`,**
  so custom cards can show why answers failed and take them again.
- **`TurnFooterContext.runIds`,** every run the turn spanned, and
  `StreamGroup.runIds`, every run that streamed into a group (kaboo-workflows
  0.28.2).

### Fixed

- **Answers that never reach the agent come back to be answered again.** When
  the host refused a decision, the resumed run ended before the agent started,
  CopilotKit's interrupt state stayed sealed and the cards stayed "Response
  submitted", with tool rows spinning, until a reload. The handler now
  reconnects the agent, so the still-open requests come back unanswered, and
  shows the reason above them. A request that fails to send recovers the same
  way, instead of leaving an unhandled rejection.
- **A message sent after a failed answer leaves no made-up results.** The tool
  messages CopilotKit adds with an answer are dropped when a message skips the
  requests, as they already were when a resume started, so the agent never
  reads an answer as a tool's result.
- **Tools still running when a run errors or stops show as cancelled** instead
  of spinning in a settled group.
- **A turn resumed after an answer ends after its last reply.** The resumed
  run's messages weren't tied to their turn, so the `turnFooter` slot rendered
  under the last message before the pause, with only the first run's groups,
  and nothing after the reply. Runs now map to their turn through the groups'
  `runIds` (kaboo-workflows 0.28.2).

## [0.11.1]

### Fixed

- **A plain agent's questions show in the chat.** For an agent whose tools
  render in the chat (no agent card of its own), the chat-level slot leaves a
  waiting `ask_user` prompt to its tool call, but `KabooAskUser` only drew a
  question once it was answered, so nothing appeared and the person's next
  message skipped it. The tool call now shows the live form while the question
  waits, then the answers, and a skipped question as Skipped: the same row an
  agent card's timeline uses.

## [0.11.0]

See [Upgrading](docs/upgrading.md#011).

### Changed

- **The AG-UI 1.0 generation:** `@copilotkit/react-core` 1.78 or later (peer
  `>=1.78.0 <2`). kaboo-react 0.10 stays the release for CopilotKit 1.62 to
  1.71.1.

### Fixed

- **An approved call no longer shows its approval as its result.** CopilotKit
  adds a tool message carrying the answer when it resumes a tool-call
  interrupt; `KabooInterruptHandler` drops it, so the call's card waits for the
  real result.

## [0.10.1]

### Fixed

- **The peer ranges stop at the CopilotKit versions kaboo-react 0.10 is tested
  with,** 1.62 to 1.71.1 (AG-UI 0.0.57 to 0.0.59). CopilotKit 1.71.2 and later
  pull in AG-UI 1.0 pieces: from 1.71.2 its `@ag-ui/mcp-apps-middleware` range
  resolves to a release that needs `@ag-ui/client` 1.0, and 1.76 moves to
  `@ag-ui/client` 1.0 itself. Those need the next minor release.

## [0.10.0]

See [Upgrading](docs/upgrading.md#010) for the code before and after.

### Added

- **A built-in multiple-choice question card:** the agent's options, single or
  multi-select, an Other row with a text field on every question, Submit and
  Skip, styled with the theme tokens.
- **A richer approval card:** Approve, "Allow for this chat" and "Always allow"
  when the agent offers them (narrowed for the whole app by `approvalScopes`
  on `KabooProvider`), with "Applies to …" naming what they cover; Deny with an
  optional reason; Approve all and Deny all with two or more approvals waiting;
  a deadline countdown and Dismiss once it has passed. Tool-requested approvals
  render on the same card.
- **`ApprovalActions` and `useApprovalDecision`** keep custom approval cards
  standard; `PermissionList` renders remembered permissions with Revoke.
- **Custom request kinds:** `interruptRenderers` is keyed by any request kind,
  with a fallback card showing the message and Skip.

### Changed

- **Breaking: no free-text box on the question card.** Other replaces it; an
  older agent's question without options is answered through Other alone.
- **Breaking: Deny replaces Reject** and is sent through
  `onResolve({ status: "cancelled", reason })`; `onCancel()` now means skip.
  Approve sends a scope: `{ status: "approved", scope: "once" }`.
- **Breaking: custom request kinds replace `kaboo_kind`.**
- **Sending a message skips what is waiting** instead of being refused by the
  AG-UI client and lost.
- **Wording:** a skipped question reads "Skipped" (was "Declined by user").

## [0.9.2]

### Fixed

- **The cached share no longer passes 100%.** `cachedShare`, and the "% cached"
  in agent cards and the drill view, divided cache reads by `inputTokens`. But
  Bedrock and Anthropic count uncached input, cache reads and cache writes
  separately, so a run that read most of its prompt from the cache showed 166%,
  and every share was overstated. It is now cache reads over the sum of the
  three, and `TokenUsage` says that `inputTokens` leaves cache tokens out.
- **"in" counts the whole prompt.** Agent cards and the drill view showed only
  the uncached input beside the cached share; they now show the sum it is a
  share of.

## [0.9.1]

### Fixed

- **No more empty "Thought for a few seconds" rows.** Models that sign their
  thinking without sending its text produce reasoning messages with no
  content, and CopilotKit drew a collapsed header for every one of them.
  `KabooMessageView` now drops reasoning messages with no text (an encrypted
  value alone does not count) and merges adjacent ones into a single block
  that keeps the first message's id.
- **The run-start indicator clears once the turn shows activity.** It stayed
  up for the whole run whenever the work happened in delegated agents, so
  "Working on it..." sat beside a live agent card. It now hides as soon as the
  current turn has an activity group, delegated agents included, and groups
  from earlier turns do not count. The current turn is the one the latest
  user message started, so it survives an interrupt resume or a continuation.
  A plain agent's own entry group is never drawn as a card and does not count
  either. On streams without `kaboo.message_meta` (no kaboo-runtime) the
  indicator hides while any group is active.

### Changed

- **`MessageMeta.runId` is set for user messages too**, from the run their
  `kaboo.message_meta` event arrived in. `KabooMessageView` reads it to find
  the current turn.

## [0.9.0]

kaboo-workflows re-sent the whole activity tree on every change, which put long
runs into AgentCore's 100 MiB response cap — the socket closes with no terminal
event and a healthy tool is reported as failed. The producer now sends the tree
once per response and patches it; this release is the other half.

This version reads both the old and new shapes, so it can be deployed before the
producer. The reverse does not hold.

### Added

- **`ACTIVITY_DELTA` support.** `KabooActivityProvider` applies the JSON Patches
  that follow each response's opening snapshot, using the same `fast-json-patch`
  as `@ag-ui/client` so both agree on semantics. This is the package's first
  runtime dependency. A patch that cannot be applied leaves the tree as it was
  and warns; the run's closing snapshot settles it.
- **`resolveTimelineTool`** and **`timelineToolUseId`** resolve a timeline entry
  to its `ToolCall` from either shape.
- **`applyActivityPatch`** for hosts that maintain their own activity state.
- **Continuation pauses are resumed automatically.** A run too large for one
  HTTP response now stops at a tool call and continues in the next one, which
  it signals as an interrupt with `reason: "continuation"`.
  `KabooInterruptHandler` resolves those the moment they arrive and renders
  nothing for them, so the split is invisible: no prompt, no card, and the turn
  keeps its id. Real gates opened alongside one still prompt as usual. Needs
  kaboo-workflows 0.21 or later to be sent any.

### Changed

- **Breaking: `Timeline` requires a `tools` prop.** Timeline tool entries now
  carry `toolUseId` rather than the call itself, so the group's `tools` are
  needed to resolve them. `AgentCard` and `DrillDetailView` pass it for you;
  only direct `Timeline` users are affected.
- **Deprecated: `StreamGroup.tokens`.** It duplicated the timeline's text, was
  read by nothing here, and is no longer sent. Now optional on the type, so code
  that mentions it still compiles. Read `timeline` text entries instead.

## [0.8.0]

### Added

- **Turn feedback.** `useTurnFeedback` and `TurnFeedback` let hosts collect
  thumbs-up / thumbs-down (plus an optional comment) on a completed turn.
  The library stores nothing: the host's `onFeedback` callback receives
  `{ value, comment, traceId, runId, turnId }` and forwards it wherever
  scores live (typically a backend that posts to Langfuse).
- **`traceId` on activity.** `StreamGroup.traceId`, `ActivityState.traceByRun`,
  and `TurnFooterContext.traceId` carry the OpenTelemetry trace id when the
  workflow service runs with telemetry enabled, so a score attaches to the
  exact run.

## [0.4.1]

### Added

- **"Custom tool cards" guide** (`docs/tool-cards.md`) — the `toolRenderers`
  registry shipped in 0.4.0 with only a changelog entry and TSDoc. The page
  covers both registration points (timelines via `toolRenderers`, the chat
  transcript via `useRenderTool`), the `ToolCall` fields a card receives, and
  when a structured renderer is the better fit.

### Fixed

- **The `@` menu shows the query you typed, not the one you typed before it.**
  Provider searches are async and fire on every keystroke, so a slow provider
  answering an earlier query could resolve last and replace the rows for the
  current one. Each refresh now carries a sequence number and a stale answer is
  discarded.
- **Providers are searched concurrently.** The menu awaited each provider in
  turn, so the slowest search delayed every provider after it in the list. They
  now run together, and one provider throwing still lists the rest.

## [0.4.0]

### Added

- **Per-tool-name renderers inside activity timelines.** New `toolRenderers`
  registry (`ToolRenderersProvider` / `useToolRenderer`, plus a `toolRenderers`
  prop on `KabooProvider`) mirrors the `interruptRenderers` pattern: a renderer
  registered for an exact tool name replaces the built-in `ToolRow` everywhere
  a `Timeline` draws that tool — top-level `AgentCard`s, nested drill views,
  and sub-agent activity. Chat-transcript tool calls already support custom
  cards via CopilotKit's `useRenderTool`; this closes the gap for multi-agent
  activity surfaces so interactive tool cards look the same at every depth.
  An inline approval gate anchored to the tool call still renders under the
  custom card.

## [0.3.0]

### Fixed

- **Gated tools on plain agents now render their approval prompt.** A plain
  (non-swarm) agent's tool rows are rendered by the wildcard tool renderer, not
  by an `AgentCard` timeline — but the chat-level interrupt slot deferred to the
  tool anchor whenever the pending tool existed in the activity groups, so the
  prompt was never drawn anywhere. `KabooToolRender` now renders the anchored
  interrupt gate inline under the tool row, matching the `Timeline` behaviour.

### Changed

- **`interruptRenderers` now apply everywhere.** The per-type renderer overrides
  passed to `KabooProvider` were only used by the chat-level slot; timeline
  anchors and the wildcard tool row hardcoded the built-in `InterruptRenderer`.
  The overrides now flow through a new `InterruptRenderersProvider` context and
  are honoured by every surface (`useInterruptRenderer` resolves the override or
  falls back to the built-in renderer).

### Added

- `InterruptRenderersProvider`, `useInterruptRenderer`, and the
  `InterruptRenderers` type are exported for hosts that mount surfaces outside
  `KabooProvider`.

## [0.2.0]

### Added

- **References & attachments.** A pluggable `@`/`+` reference system for the chat
  composer:
  - `KabooReferenceInput` — a drop-in `<CopilotChat input={…}>` slot that keeps
    CopilotKit's native input chrome but renders each reference as an interactive
    inline chip, with a shared searchable popover for both `+` and `@`.
  - `ReferencesProvider` / `ReferenceStateSync` / `useReferences` — register
    providers, stage pending references, and sync object references onto
    `agent.state`.
  - `uploadProvider` (+ `isUploadProvider`, `buildAttachmentsConfig`,
    `uploadFileToReference`, `UPLOAD_MARKER`) — the built-in file-attachment
    provider, with URL or base64 upload.
  - Serialization helpers (`mintReferenceId`, `referenceMarker`,
    `attachmentToInputContent`, `objectToStateEntry`, `serializeReferences`,
    `withReferenceState`, `buildUserContent`).
  - Public types/constants: `ReferenceProvider`, `ReferenceItem`,
    `PendingReference`, `ReferenceTransport`, `REFERENCE_METADATA_KEYS`,
    `REFERENCES_STATE_KEY`.
- `kaboo-react/copilotkit`: `KabooUserMessage` — renders sent references as
  non-interactive chips (inline `@` mentions and a file/object chip row) in the
  user bubble.
- "References & providers" guide (`docs/references.md`) documenting the provider
  contract, both transports, and searchable vs action-only providers.

### Changed

- `KabooMessageView` now wires `KabooUserMessage` so references sent with a
  message render as chips instead of raw text.

## [0.1.0]

Initial release.

### Added

- `kaboo-react` main barrel: `KabooProvider` (batteries-included CopilotKit
  plugin), `KabooActivityProvider`, `DrillProvider`, `InterruptBridgeProvider`,
  hooks (`useActivity`, `useDrill`, `useInterruptBridge`, `useInterruptFor`),
  activity components (`ActivityPanel`, `AgentCard`, `Timeline`, `ToolRow`,
  `MiniTable`, `GlassTabs`, `DrillDetailView`, `MarkdownContent`,
  `InterruptRenderer`), group helpers (`topLevelGroups`, `directChildren`) and
  formatters (`formatToolInput`, `formatToolResult`, `normalizeResult`).
- `kaboo-react/copilotkit` subpath: CopilotKit-coupled integrations
  (`KabooMessageView`, `KabooAssistantMessage`, `KabooInlineCards`,
  `KabooInterruptHandler`, `KabooAskUser`, `KabooToolRender`).
- `kaboo-react/styles.css` stylesheet with themeable `--kaboo-*` design tokens.

[Unreleased]: https://github.com/gl-pgege/kaboo-react/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/gl-pgege/kaboo-react/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/gl-pgege/kaboo-react/releases/tag/v0.1.0
