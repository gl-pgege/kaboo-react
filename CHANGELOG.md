# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
