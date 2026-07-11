#!/usr/bin/env node
/**
 * docs:llms — generates the AI-native docs index at the repo root:
 *
 * - llms.txt      — an llmstxt.org index: title, summary, and curated link
 *                   sections pointing at the published docs site.
 * - llms-full.txt — README.md + every guide (in mkdocs nav order) concatenated,
 *                   each prefixed with a `# <path>` header and separated by
 *                   `---`, so an LLM can ingest the whole doc set in one file.
 *
 * Zero dependencies and deterministic, so CI can diff for drift. Keep NAV in
 * sync with mkdocs.yml.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = "https://gl-pgege.github.io/@kaboo/react/";
const REPO = "https://github.com/gl-pgege/kaboo-react";

const SUMMARY =
  "React components + hooks for rendering kaboo multi-agent activity in a " +
  "CopilotKit app, with batteries-included CopilotKit integrations.";

// Mirrors mkdocs.yml nav (excluding the generated api/ tree).
const NAV = [
  { title: "Home", path: "docs/index.md", url: PAGES },
  { title: "Getting started", path: "docs/getting-started.md", url: `${PAGES}getting-started/` },
  { title: "Theming", path: "docs/theming.md", url: `${PAGES}theming/` },
  { title: "Structured renderers", path: "docs/structured-renderers.md", url: `${PAGES}structured-renderers/` },
  { title: "Human-in-the-loop", path: "docs/hitl.md", url: `${PAGES}hitl/` },
  { title: "Activity panel", path: "docs/activity-panel.md", url: `${PAGES}activity-panel/` },
  { title: "CopilotKit subpath", path: "docs/copilotkit-subpath.md", url: `${PAGES}copilotkit-subpath/` },
  { title: "API inventory", path: "docs/api-inventory.md", url: `${PAGES}api-inventory/` },
];

const read = (p) => readFileSync(join(ROOT, p), "utf8");

// ---- llms.txt -------------------------------------------------------------
let llms = `# kaboo-react\n\n> ${SUMMARY}\n\n`;
llms +=
  "kaboo-react renders a live, hierarchical view of agent activity — sub-agent " +
  "cards, tool calls, streamed tokens, structured outputs, drill-down, and " +
  "human-in-the-loop interrupts — inside a CopilotKit chat. Activity rides the " +
  "AG-UI run stream (as `ACTIVITY_SNAPSHOT` events); there is no separate " +
  "endpoint. It ships two barrels (`kaboo-react`, `@kaboo/react/copilotkit`) and " +
  "a `@kaboo/react/styles.css` stylesheet.\n\n";

llms += "## Docs\n\n";
for (const n of NAV) llms += `- [${n.title}](${n.url})\n`;

llms += "\n## API\n\n";
llms += `- [API reference](${PAGES}api/): auto-generated TypeDoc for both barrels.\n`;
llms += `- [API inventory](${PAGES}api-inventory/): every public export.\n`;

llms += "\n## Examples\n\n";
llms += `- [examples/minimal](${REPO}/tree/main/examples/minimal): smallest end-to-end wiring.\n`;
llms += `- [kaboo-workflows-demo](https://github.com/gl-pgege/kaboo-docs/tree/main/examples/kaboo-workflows-demo): full demo app.\n`;

llms += "\n## Related\n\n";
llms += "- [kaboo-workflows](https://github.com/gl-pgege/kaboo-workflows): Python multi-agent orchestration.\n";
llms += "- [kaboo-runtime](https://github.com/gl-pgege/kaboo-runtime): CopilotKit runtime persistence/orchestration plugin.\n";

writeFileSync(join(ROOT, "llms.txt"), llms);

// ---- llms-full.txt --------------------------------------------------------
const files = ["README.md", ...NAV.map((n) => n.path)];
const full = files
  .map((p) => `# ${p}\n\n${read(p).trim()}\n`)
  .join("\n---\n\n");

writeFileSync(join(ROOT, "llms-full.txt"), full);

console.log("Wrote llms.txt and llms-full.txt");
