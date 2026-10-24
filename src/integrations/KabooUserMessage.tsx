import type { ReactNode } from "react";
import {
  CopilotChatUserMessage,
  type CopilotChatUserMessageProps,
} from "@copilotkit/react-core/v2";
import { useReferences } from "../references/ReferencesProvider";
import type { PendingReference } from "../references/types";
import { useMessageMeta } from "../context/MessageMeta";
import { useKabooSlots, type SlotMessage } from "../context/KabooSlots";

const Bubble = CopilotChatUserMessage.MessageRenderer as unknown as (props: {
  content: ReactNode;
  className?: string;
}) => ReactNode;

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

/** Keep only entries that look like renderable references (a name to chip). */
function asPendingReferences(refs: unknown[] | undefined): PendingReference[] {
  if (!Array.isArray(refs)) return [];
  return refs.filter(
    (r): r is PendingReference =>
      !!r && typeof r === "object" && typeof (r as { name?: unknown }).name === "string",
  );
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
 * they come from the per-message registry on {@link useReferences} — with a
 * fallback to the durable per-message metadata recovered from the event stream
 * ({@link useMessageMeta}), so chips survive a reload. Files come from the
 * message's media parts.
 *
 * The app's `userMessageFooter` slot (when provided) renders under the bubble.
 */
export function KabooUserMessage(props: CopilotChatUserMessageProps) {
  const { messageReferences } = useReferences();
  const messageMeta = useMessageMeta();
  const { userMessageFooter } = useKabooSlots();
  const message = props.message as { id?: string; content?: unknown } | undefined;
  const id = message?.id;
  const sessionRefs = id ? messageReferences[id] : undefined;
  const objectRefs =
    sessionRefs && sessionRefs.length > 0
      ? sessionRefs
      : asPendingReferences(id ? messageMeta[id]?.references : undefined);
  const text = messageText(message?.content);
  const files = fileParts(message?.content);

  const inlineRefs = objectRefs.filter((r) => text.includes(`@${r.name}`));
  const trayRefs = objectRefs.filter((r) => !text.includes(`@${r.name}`));
  const hasChipRow = files.length > 0 || trayRefs.length > 0;

  const MessageRenderer = ({ content, className }: { content: string; className?: string }) => (
    <>
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
      <Bubble content={renderInline(content, inlineRefs)} className={className} />
      {userMessageFooter && (
        <div className="kaboo-message-footer">
          {userMessageFooter(message as unknown as SlotMessage)}
        </div>
      )}
    </>
  );

  return (
    <CopilotChatUserMessage
      {...props}
      message={{ ...props.message, content: text }}
      onEditMessage={props.onEditMessage && (() => props.onEditMessage?.({ message: props.message }))}
      className={props.className ? `kaboo-user-message ${props.className}` : "kaboo-user-message"}
      messageRenderer={MessageRenderer as unknown as typeof CopilotChatUserMessage.MessageRenderer}
    />
  );
}
