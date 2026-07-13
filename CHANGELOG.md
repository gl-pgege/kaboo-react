# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
