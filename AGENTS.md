# AGENTS.md

Guidance for AI agents contributing to **kaboo-react**. Humans: see
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Commands

```bash
corepack enable            # once; Yarn 4 is pinned via packageManager
yarn install --immutable   # install
yarn build                 # tsup -> dist/ (both barrels + styles.css)
yarn test                  # vitest run
yarn typecheck             # tsc --noEmit (src, excludes tests)
yarn docs:api              # typedoc + regenerate docs/api-inventory.md (completeness gate)
yarn docs:verify           # type-check every tsx/ts snippet in README + docs
yarn docs:llms             # regenerate llms.txt + llms-full.txt
yarn examples:typecheck    # type-check examples/ against built types
```

`prepack` runs build + docs:api + docs:llms + docs:verify + test (fires on
`yarn pack` and `yarn npm publish`).

## Architecture & conventions

- **Two barrels.**
  - `kaboo-react` (`src/index.ts`) — framework-agnostic contexts, hooks,
    components, utils, formatters, types.
  - `kaboo-react/copilotkit` (`src/copilotkit.ts`) — integrations coupled to
    CopilotKit. **Put any CopilotKit-dependent code here, never in the main
    barrel.**
- **Stylesheet.** `src/styles.css` is copied to `dist/styles.css` by tsup and
  exported as `kaboo-react/styles.css`. Theming is via CSS variables only
  (`--background`/`--foreground`/`--card`/`--muted`/`--border` + `--kaboo-*`
  overrides). Do not add a CSS-in-JS dependency.
- **Peer deps.** `react`, `react-dom`, `@copilotkit/react-core`. Do not add
  runtime dependencies without discussion.
- **CopilotChat slots** each integration targets:
  - `KabooMessageView` → the `messageView` slot (carries a `Cursor` static so it
    is a drop-in slot component).
  - `KabooAssistantMessage` → the assistant-message slot (used by
    `KabooMessageView`).
  - `KabooInlineCards`, `KabooInterruptHandler` → auto-mounted by `KabooProvider`.

## Playbooks

### Add a component or hook

1. Implement it under `src/` (main-barrel code) or `src/integrations/`
   (CopilotKit-coupled → `copilotkit` barrel).
2. Add a TSDoc description **and at least one `@example`** (`tsx` for
   components/providers, `ts` for utils/formatters). The completeness gate fails
   on any undocumented export.
3. Export it from the correct barrel (`src/index.ts` or `src/copilotkit.ts`).
4. Add a test under the same folder (`*.test.tsx`), following the existing
   `vi.hoisted` + `vi.mock("@copilotkit/react-core/v2", …)` pattern.
5. Run `yarn docs:api` (regenerates `docs/api` + `docs/api-inventory.md`).

### Add a guide

1. Create `docs/<name>.md`. Every `tsx`/`ts` fence must be self-contained and
   type-check under `docs:verify` (tag illustrative fragments ```` ```tsx no-verify ````).
2. Add it to `mkdocs.yml` nav **and** to the `NAV` list in
   `scripts/generate-llms.mjs` (same order).
3. Run `yarn docs:verify` and `yarn docs:llms`.

### Add an example

1. Create `examples/<name>/` with `package.json`, `tsconfig.json` (map
   `kaboo-react` → `../../dist`), `README.md`, and `src/`.
2. If a guide/README snippet copies from it, wrap the region with
   `// #region <name>` / `// #endregion` and reference it with
   `<!-- source: examples/<name>/src/File.tsx#<name> -->` above the fence.
3. Run `yarn build && yarn examples:typecheck`.

## Definition of done

- `yarn test` green.
- `yarn docs:api` passes the TypeDoc completeness gate across **both** barrels
  and produces no `docs/api` / `docs/api-inventory.md` drift.
- `yarn docs:verify` green.
- `yarn docs:llms` produces no `llms.txt` / `llms-full.txt` drift.
- `yarn examples:typecheck` green.
- `mkdocs build --strict` green.
- `yarn pack --dry-run` clean (both barrels + `styles.css` resolve).

## Guardrails

- Never add an undocumented public export.
- Never add an unverified `tsx`/`ts` snippet to the docs.
- Never point URLs at the old `kaboo/kaboo-workflows` monorepo path — use
  `gl-pgege/kaboo-react`.
- Never plan or run a live publish; the deliverable is a dry run + the publish
  command for a human to run.

## Related

- [kaboo-workflows](https://github.com/gl-pgege/kaboo-workflows)
- [kaboo-runtime](https://github.com/gl-pgege/kaboo-runtime)
- [kaboo-workflows-demo](https://github.com/gl-pgege/kaboo-workflows-demo) — the
  runnable, end-to-end reference that consumes this library.
- [The kaboo stack](https://gl-pgege.github.io/kaboo-docs/) — umbrella landing.
