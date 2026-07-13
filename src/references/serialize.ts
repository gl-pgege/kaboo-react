import type { InputContent } from "@copilotkit/shared";
import {
  REFERENCE_METADATA_KEYS,
  REFERENCES_STATE_KEY,
  type PendingReference,
} from "./types";

export type { PendingReference } from "./types";

/**
 * Mint a stable reference id. Client-minted so the same id travels in the
 * message/state AND is what the agent later reads from the manifest and passes
 * to a tool. Prefixed by kind for readability in logs/manifests.
 */
export function mintReferenceId(kind: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${kind}_${rand}`;
}

/**
 * The textual marker kept at a reference's mention position in the message
 * text, so the model sees *where* each reference was cited (correlated to the
 * manifest by id). Chip UIs render `@name`; the serialized text keeps this
 * token.
 */
export function referenceMarker(ref: PendingReference): string {
  return `[${ref.kind}:${ref.id}]`;
}

/** AG-UI `AttachmentModality` for a mime type (best-effort; documents are the fallback). */
function modalityFor(mimeType: string): "image" | "audio" | "video" | "document" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

/**
 * Turn an `attachment`-transport reference into a CopilotKit `InputContent`
 * part, stamping the reference id/kind/name into `metadata` so kaboo-workflows
 * can key its registry off the same id the model reads from the manifest.
 */
export function attachmentToInputContent(
  ref: Extract<PendingReference, { transport: "attachment" }>,
): InputContent {
  const source =
    "url" in ref.source
      ? { type: "url" as const, value: ref.source.url, mimeType: ref.mimeType }
      : { type: "data" as const, value: ref.source.data, mimeType: ref.mimeType };
  return {
    type: modalityFor(ref.mimeType),
    source,
    metadata: {
      [REFERENCE_METADATA_KEYS.id]: ref.id,
      [REFERENCE_METADATA_KEYS.kind]: ref.kind,
      [REFERENCE_METADATA_KEYS.name]: ref.name,
      filename: ref.name,
    },
  } as InputContent;
}

/** The serialized shape of an object reference inside `state.kaboo_references`. */
export interface SerializedObjectReference {
  /** Reference kind (e.g. `"table"`), resolved by the app's MCP tool. */
  kind: string;
  /** Stable reference id, shared with the backend manifest. */
  id: string;
  /** Human-readable label. */
  name: string;
  /** Arbitrary extra context threaded through to the resolver. */
  meta?: Record<string, unknown>;
}

/** Project an `object`-transport reference to its wire shape. */
export function objectToStateEntry(
  ref: Extract<PendingReference, { transport: "object" }>,
): SerializedObjectReference {
  return { kind: ref.kind, id: ref.id, name: ref.name, meta: ref.meta };
}

/** The fully serialized outgoing payload derived from a set of pending references. */
export interface SerializedReferences {
  /** `InputContent` parts for attachment-transport references (append after text). */
  attachmentParts: InputContent[];
  /** Object-transport references destined for `state.kaboo_references`. */
  objectReferences: SerializedObjectReference[];
}

/** Split + serialize pending references into attachment parts and object-state entries. */
export function serializeReferences(refs: PendingReference[]): SerializedReferences {
  const attachmentParts: InputContent[] = [];
  const objectReferences: SerializedObjectReference[] = [];
  for (const ref of refs) {
    if (ref.transport === "attachment") {
      attachmentParts.push(attachmentToInputContent(ref));
    } else {
      objectReferences.push(objectToStateEntry(ref));
    }
  }
  return { attachmentParts, objectReferences };
}

/**
 * Merge object references into an existing AG-UI `state` under
 * {@link REFERENCES_STATE_KEY}. Returns a new object; empty input clears the key
 * so a prior turn's references never leak into the next run.
 */
export function withReferenceState(
  state: Record<string, unknown> | undefined,
  objectReferences: SerializedObjectReference[],
): Record<string, unknown> {
  const next = { ...(state ?? {}) };
  if (objectReferences.length > 0) {
    next[REFERENCES_STATE_KEY] = objectReferences;
  } else {
    delete next[REFERENCES_STATE_KEY];
  }
  return next;
}

/**
 * Build the multimodal `content` array for a user message: the typed text
 * (already containing positional markers) followed by the attachment parts.
 * AG-UI content is an ordered array, so parts are appended after the text.
 */
export function buildUserContent(
  text: string,
  attachmentParts: InputContent[],
): InputContent[] {
  const parts: InputContent[] = [];
  if (text.length > 0) parts.push({ type: "text", text } as InputContent);
  parts.push(...attachmentParts);
  return parts;
}
