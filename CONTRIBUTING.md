# Contributing to kaboo-react

Thanks for contributing! This guide is for human contributors. AI agents should
also read [AGENTS.md](./AGENTS.md).

## Prerequisites

- Node.js >= 18
- Yarn 4 (Berry). The repo pins it via the `packageManager` field; run
  `corepack enable` once and Yarn resolves the right version automatically.

## Install

```bash
yarn install --immutable
```

## Dev loop

```bash
yarn build          # tsup -> dist/ (both barrels + styles.css)
yarn test           # vitest run
yarn test:watch     # vitest watch
yarn typecheck      # tsc --noEmit
yarn docs:api       # typedoc completeness gate + regenerate api inventory
yarn docs:verify    # type-check every doc snippet
yarn docs:llms      # regenerate llms.txt / llms-full.txt
yarn examples:typecheck
```

## Conventions

- **Two barrels.** Framework-agnostic code goes in the `kaboo-react` barrel
  (`src/index.ts`); CopilotKit-coupled integrations go behind
  `kaboo-react/copilotkit` (`src/copilotkit.ts`).
- **Theming via CSS variables only.** No CSS-in-JS. Read design tokens
  (`--background`, `--foreground`, `--card`, `--muted`, `--border`) and expose
  `--kaboo-*` overrides.
- **Peer dependencies** are `react`, `react-dom`, and `@copilotkit/react-core`.
  Avoid adding runtime dependencies.

## Prove your docs

Every `tsx`/`ts` snippet in `README.md` and `docs/**` must type-check via
`yarn docs:verify`. Canonical, runnable usage lives in `examples/minimal` (and
the tests); when a doc snippet copies from an example, wrap the source in a
`// #region <name>` / `// #endregion` block and reference it above the fence:

```md
<!-- source: examples/minimal/src/App.tsx#quickstart -->
```

Illustrative fragments that can't compile standalone use ```` ```tsx no-verify ````.

## Commit & PR conventions

- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
  `fix:`, `docs:`, `chore:`, …).
- PRs must be green on CI: build, typecheck, test, `docs:api` (no drift),
  `docs:verify`, `docs:llms` (no drift), `examples:typecheck`, and
  `yarn pack --dry-run`.
- Add/adjust tests for behavior changes and a `CHANGELOG.md` entry under
  `Unreleased`.

## Docs site & release

- The docs site is built with MkDocs Material and deployed by
  `.github/workflows/pages.yml`. Enable it once under **Settings → Pages →
  Source: GitHub Actions**.
- Releases are cut from `main`; publishing is a manual step (`yarn npm publish`,
  which respects `publishConfig.access: public`) after review.

## Code of conduct

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).
