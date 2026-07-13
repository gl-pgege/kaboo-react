import type { ReactNode } from "react";
import {
  CopilotChatUserMessage,
  type CopilotChatUserMessageProps,
} from "@copilotkit/react-core/v2";
import { useReferences } from "../references/ReferencesProvider";
import type { PendingReference } from "../references/types";

// CopilotKit's own wrapper/bubble classes, replicated so our custom layout
// (via the children render-prop) matches the native user message exactly.
const WRAP_CLASS =
  "copilotKitMessage copilotKitUserMessage cpk:flex cpk:flex-col cpk:items-end cpk:group cpk:pt-10";
const BUBBLE_CLASS =
  "cpk:prose cpk:dark:prose-invert cpk:bg-muted cpk:relative cpk:max-w-[80%] cpk:rounded-[18px] cpk:px-4 cpk:py-1.5 cpk:inline-block cpk:whitespace-pre-wrap";

const AtIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);
const FileIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

/** A media/document/image content part on a user message. */
interface FilePart {
  kind: "image" | "audio" | "video" | "document";
  src: string;
  filename: string;
}

/** Text of a user message (string content, or joined text parts). */
function messageText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((p) =>
      p && typeof p === "object" && (p as { type?: string }).type === "text"
        ? String((p as { text?: string }).text ?? "")
        : "",
    )
    .filter(Boolean)
    .join("\n");
}

/** Extract renderable file parts (with a resolved src) from message content. */
function fileParts(content: unknown): FilePart[] {
  if (!Array.isArray(content)) return [];
  const out: FilePart[] = [];
  for (const part of content) {
    const type = (part as { type?: string })?.type;
    if (type !== "image" && type !== "audio" && type !== "video" && type !== "document") continue;
    const source = (part as { source?: { type?: string; value?: string; mimeType?: string } }).source;
    if (!source?.value) continue;
    const src =
      source.type === "url" ? source.value : `data:${source.mimeType ?? ""};base64,${source.value}`;
    const meta = (part as { metadata?: { filename?: string } }).metadata;
    out.push({ kind: type, src, filename: meta?.filename ?? source.mimeType ?? "file" });
  }
  return out;
}

/** Non-interactive object-reference chip (`@name`). */
function ObjectChip({ reference, inline }: { reference: PendingReference; inline?: boolean }) {
  return (
    <span
      className={`kaboo-chip kaboo-chip-object kaboo-msg-chip${inline ? " kaboo-msg-chip-inline" : ""}`}
      title={reference.name}
    >
      <span className="kaboo-chip-ic">{AtIcon}</span>
      <span className="kaboo-chip-label">{reference.name}</span>
    </span>
  );
}

/** Non-interactive file chip: image preview or document icon + filename. */
function FileChip({ file }: { file: FilePart }) {
  return (
    <span className="kaboo-chip kaboo-chip-attachment kaboo-msg-chip" title={file.filename}>
      {file.kind === "image" ? (
        <img className="kaboo-chip-thumb" src={file.src} alt={file.filename} />
      ) : (
        <span className="kaboo-chip-ic">{FileIcon}</span>
      )}
      <span className="kaboo-chip-label">{file.filename}</span>
    </span>
  );
}

/** Split text on inline reference tokens (`@name`), rendering each as a chip. */
function renderInline(text: string, refs: PendingReference[]): ReactNode[] {
  if (refs.length === 0) return [text];
  const tokens = refs
    .map((ref) => ({ ref, token: `@${ref.name}` }))
    .sort((a, b) => b.token.length - a.token.length);
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const hit = tokens.find((t) => text.startsWith(t.token, i));
    if (hit) {
      out.push(<ObjectChip key={key++} reference={hit.ref} inline />);
      i += hit.token.length;
      continue;
    }
    let next = text.length;
    for (const t of tokens) {
      const idx = text.indexOf(t.token, i + 1);
      if (idx !== -1 && idx < next) next = idx;
    }
    out.push(text.slice(i, next));
    i = next;
  }
  return out;
}

/**
 * Drop-in replacement for `CopilotChatMessageView`'s `userMessage` slot that
 * renders every reference the user sent as a **non-interactive chip**, so a
 * reference reads as a reference rather than plain text:
 *
 * - object references cited inline (`@name`) render as chips *within* the text;
 * - files and objects added via the `+` tray render as a chip row above the
 *   bubble (files show a thumbnail/icon + filename).
 *
 * Object references ride `state.kaboo_references` (not the message content), so
 * they come from the per-message registry on {@link useReferences}; files come
 * from the message's media parts.
 */
export function KabooUserMessage(props: CopilotChatUserMessageProps) {
  const { messageReferences } = useReferences();
  const message = props.message as { id?: string; content?: unknown } | undefined;
  const id = message?.id;
  const objectRefs = (id ? messageReferences[id] : undefined) ?? [];
  const text = messageText(message?.content);
  const files = fileParts(message?.content);

  const inlineRefs = objectRefs.filter((r) => text.includes(`@${r.name}`));
  const trayRefs = objectRefs.filter((r) => !text.includes(`@${r.name}`));
  const hasChipRow = files.length > 0 || trayRefs.length > 0;

  const MessageRenderer = ({ content, className }: { content: string; className?: string }) => (
    <div className={className ? `${BUBBLE_CLASS} ${className}` : BUBBLE_CLASS}>
      {renderInline(content, inlineRefs)}
    </div>
  );

  return (
    <CopilotChatUserMessage
      {...props}
      messageRenderer={MessageRenderer as unknown as typeof CopilotChatUserMessage.MessageRenderer}
    >
      {({ messageRenderer, toolbar }) => (
        <div data-copilotkit data-message-id={id} className={`${WRAP_CLASS} kaboo-user-message`}>
          {hasChipRow && (
            <div className="kaboo-msg-refs">
              {files.map((f, i) => (
                <FileChip key={`f${i}`} file={f} />
              ))}
              {trayRefs.map((r) => (
                <ObjectChip key={r.id} reference={r} />
              ))}
            </div>
          )}
          {messageRenderer}
          {toolbar}
        </div>
      )}
    </CopilotChatUserMessage>
  );
}
