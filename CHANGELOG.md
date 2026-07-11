# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- `@kaboo/react/copilotkit` subpath: CopilotKit-coupled integrations
  (`KabooMessageView`, `KabooAssistantMessage`, `KabooInlineCards`,
  `KabooInterruptHandler`, `KabooAskUser`, `KabooToolRender`).
- `@kaboo/react/styles.css` stylesheet with themeable `--kaboo-*` design tokens.

[Unreleased]: https://github.com/gl-pgege/@kaboo/react/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/gl-pgege/@kaboo/react/releases/tag/v0.1.0
