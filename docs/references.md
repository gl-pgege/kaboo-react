# References & providers

Let users **attach things to a message** — files *and* your own domain entities
(tables, dashboards, tickets, customers, …). Everything is driven by
**reference providers** you register on `<KabooProvider references={…}>` and the
`KabooReferenceInput` composer slot.

This guide covers what a provider is, the two transports, and how to write your
own. The backend half — making a reference actually reach an agent — is covered
in kaboo-workflows' *Attachments & Multimodal* chapter.

## Mental model

A **provider** is a pluggable source of "things you can reference" in the shared
`+` / `@` popover. It answers three questions:

1. **What can be referenced?** — the items it lists (`search`) or the action it
   runs (`onSelect`, e.g. a file picker).
2. **How is it shown in the picker?** — its `label`, `icon`, and optional
   `renderItem`.
3. **What does a chosen one become on the wire?** — `toReference`, which maps a
   selection to a `PendingReference` with a *transport*.

When the user picks an item, the composer stages it as a chip and, on submit,
serializes it onto the outgoing message according to its transport.

!!! note "Providers don't style chips"
    A provider controls how an item looks **in the popover menu** (`icon`,
    `renderItem`) and what it *becomes* (`toReference`). It does **not** control
    how the chip renders in the editor or the sent bubble — that is centralized
    in `KabooReferenceInput` / `KabooUserMessage` and derived from the
    reference's transport, mime type, and name.

## The two transports

Every reference reaches the agent as one of two transports:

| Transport    | For                                   | Carries bytes? | Serialized as                                   | Resolved by                                  |
| ------------ | ------------------------------------- | -------------- | ----------------------------------------------- | -------------------------------------------- |
| `attachment` | files/blobs (pdf, image, csv, …)      | yes            | a CopilotKit `InputContent` part on the message | the built-in `fetch_attachment` tool         |
| `object`     | pointers to *your* entities           | no             | an entry in `state.kaboo_references`            | *your* MCP tool (per `kind`)                 |

`attachment` is the only blob-capable transport. An `object` is just a pointer
`{ kind, id, name }`; your backend resolves it on demand.

## Register providers

Pass providers to `KabooProvider` and use the `KabooReferenceInput` slot:

```tsx no-verify
import { CopilotChat } from "@copilotkit/react-core/v2";
import {
  KabooProvider,
  KabooReferenceInput,
  uploadProvider,
} from "@pgege/kaboo-react";
import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";
import { tableProvider } from "./references";

<KabooProvider
  runtimeUrl="/api/copilotkit"
  agent={agent}
  threadId={threadId}
  references={[uploadProvider({ accept: "image/*,.pdf", onUpload }), tableProvider]}
>
  <CopilotChat input={KabooReferenceInput} messageView={KabooMessageView} />
</KabooProvider>;
```

## Anatomy of a `ReferenceProvider`

```ts no-verify
interface ReferenceProvider<T = unknown> {
  id: string;                                          // stable provider id
  label: string;                                       // group heading in the menu
  icon?: ReactNode;                                    // icon beside the heading
  search?: (query: string) =>                          // omit → action-only
    ReferenceItem<T>[] | Promise<ReferenceItem<T>[]>;
  renderItem?: (item: ReferenceItem<T>) => ReactNode;  // custom menu row
  onSelect?: (item: ReferenceItem<T>) => void | Promise<void>; // side effect on choose
  toReference?: (item: ReferenceItem<T>) => PendingReference;   // becomes this on the wire
}

// Each searchable item; `data` is provider-defined and threaded to toReference.
interface ReferenceItem<T = unknown> {
  id: string;
  label: string;         // default chip text
  description?: string;  // optional secondary line
  data?: T;
}
```

A provider is either:

- **searchable** — supplies `search`, so its items list live in the menu as the
  user types; or
- **action-only** — omits `search`; selecting its group row runs `onSelect`
  (e.g. opening a file dialog). The built-in `uploadProvider` is action-only.

## Write an object provider

Three fields make a custom entity referenceable — `search` (what to list),
`toReference` (what it becomes), and `icon` (how it's grouped):

```tsx
import { Table2 } from "lucide-react";
import type { ReferenceProvider } from "@pgege/kaboo-react";

const TABLES = [
  { id: "companies", label: "companies", description: "Vendors and company profiles" },
  { id: "products", label: "products", description: "Product catalog with pricing" },
];

export const tableProvider: ReferenceProvider = {
  id: "table",
  label: "Tables",
  icon: <Table2 size={16} />,
  // Items listed under @ for the current query.
  search: (q) =>
    TABLES.filter((t) => t.label.toLowerCase().includes(q.toLowerCase())),
  // How a chosen item serializes onto the message.
  toReference: (item) => ({
    transport: "object",
    kind: "table",
    id: item.id,
    name: item.label,
    meta: { description: item.description },
  }),
};
```

The selected object syncs into `state.kaboo_references` and appears inline as an
`@name` chip. Your backend resolves the `{ kind: "table", id }` pointer with its
own tool. Add more object kinds (dashboards, tickets, …) by registering more
providers with distinct `kind`s.

!!! tip "`meta` rides along"
    Anything you put in `toReference(...).meta` travels in `state.kaboo_references`
    and is available to your resolver tool — handy for extra context the id
    alone doesn't capture.

## Files: the built-in `uploadProvider`

File upload ships as a provider. Register it with your `onUpload`:

```tsx
import { uploadProvider } from "@pgege/kaboo-react";
import type { AttachmentUploadResult } from "@copilotkit/shared";

async function onUpload(file: File): Promise<AttachmentUploadResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const { url, mimeType } = await res.json();
  return { type: "url", value: url, mimeType }; // a fetchable URL
}

uploadProvider({ accept: "image/*,.pdf,.csv,.txt,.md", maxSize: 20 * 1024 * 1024, onUpload });
```

- **Return a URL, not base64.** The server fetches attachment URLs with no auth
  (presigned/public pattern), which keeps the AG-UI transport *and* the
  persisted event log small.
- **`onUpload` is optional.** Omit it and the file is inlined as base64 — fine
  for small files/tests, but it bloats storage for large ones.
- `accept` and `maxSize` gate the picker; oversized files are rejected before
  upload.

Choosing "Attach a file" (from **+** or **@**) opens the picker, uploads, and
drops a file chip. The file rides the message as an `InputContent` part stamped
with `kaboo_id` / `kaboo_kind` / `kaboo_name` metadata.

## Action-only providers

Omit `search` to make the group row itself an action. Use `onSelect` for the
side effect; produce the reference either synchronously via `toReference` or
asynchronously (as `uploadProvider` does through its upload callback):

```tsx no-verify
const pickFromDrive: ReferenceProvider = {
  id: "drive",
  label: "Google Drive",
  icon: <DriveIcon />,
  onSelect: async () => {
    /* open your picker, upload, and stage the reference */
  },
};
```

## What a chosen item becomes

`toReference` returns a `PendingReference`:

```ts
type PendingReference =
  | { transport: "attachment"; kind: string; id: string; name: string;
      mimeType: string; source: { url: string } | { data: string } }
  | { transport: "object"; kind: string; id: string; name: string;
      meta?: Record<string, unknown> };
```

On submit the composer:

- appends each **attachment** as a message content part (with the `kaboo_*`
  metadata), and
- writes each **object** into `state.kaboo_references`.

The `id` you mint is the same id the backend lists in its manifest and passes to
a resolver tool, so both stacks agree without translation.

## What providers do *not* do

- They don't render the selected chip (editor or bubble) — that's centralized.
- They don't decide the per-agent policy (`reference` / `inline` / tool
  availability) — that's the backend's `attachments:` config.

## Next steps

- [Getting started](getting-started.md) — wire kaboo-react into a CopilotKit app.
- [Theming](theming.md) — restyle chips and the composer via CSS variables.
- kaboo-workflows *Attachments & Multimodal* — how references reach each agent
  (manifest, `fetch_attachment`, inline media).
