import type { AttachmentsConfig, AttachmentUploadResult } from "@copilotkit/shared";
import { REFERENCE_METADATA_KEYS } from "./types";
import { mintReferenceId, type PendingReference } from "./serialize";
import type { ReferenceProvider } from "./types";

/** Configuration for the built-in file {@link uploadProvider}. */
export interface UploadProviderConfig {
  /** Provider id in the `@` menu. Default `"upload"`. */
  id?: string;
  /** Group label in the `@` menu. Default `"Upload"`. */
  label?: string;
  /** Reference kind stamped on emitted attachments. Default `"file"`. */
  kind?: string;
  /** `accept` filter for the file picker (e.g. `"image/*,.pdf"`). */
  accept?: string;
  /** Max file size in bytes. Files above this are rejected. Default 20MB. */
  maxSize?: number;
  /**
   * Store the file and return a fetchable source. Return a `url` (presigned or
   * public — the server fetches it with no auth) or inline `data` (base64).
   * When omitted, the file is inlined as base64 (fine for small files/tests,
   * bloats the event log for large ones).
   */
  onUpload?: (file: File) => AttachmentUploadResult | Promise<AttachmentUploadResult>;
}

/** Internal marker: identifies a {@link ReferenceProvider} produced by {@link uploadProvider}. */
export const UPLOAD_MARKER = "__kabooUpload" as const;

/** A {@link ReferenceProvider} carrying its resolved upload config for the composer. */
export interface UploadReferenceProvider extends ReferenceProvider {
  /** Resolved upload config the composer reads to drive the file picker. */
  [UPLOAD_MARKER]: Required<Pick<UploadProviderConfig, "kind" | "maxSize">> &
    Pick<UploadProviderConfig, "accept" | "onUpload">;
}

const DEFAULT_MAX_SIZE = 20 * 1024 * 1024;

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload one file and return the pending attachment reference (id minted here).
 * Uses `config.onUpload` when provided, else inlines the bytes as base64.
 */
export async function uploadFileToReference(
  file: File,
  config: UploadProviderConfig,
): Promise<PendingReference> {
  const kind = config.kind ?? "file";
  const id = mintReferenceId(kind);
  const maxSize = config.maxSize ?? DEFAULT_MAX_SIZE;
  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" exceeds the ${maxSize}-byte limit.`);
  }

  if (config.onUpload) {
    const result = await config.onUpload(file);
    const mimeType = result.mimeType ?? file.type ?? "application/octet-stream";
    const source =
      result.type === "url" ? { url: result.value } : { data: result.value };
    return { transport: "attachment", kind, id, name: file.name, mimeType, source };
  }

  const data = await readAsBase64(file);
  return {
    transport: "attachment",
    kind,
    id,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    source: { data },
  };
}

/**
 * Built-in file-upload {@link ReferenceProvider}. Action-only: choosing it in
 * the `@` menu opens the file picker; the composer uploads the file (via
 * `onUpload` or base64) and adds an `attachment`-transport reference.
 *
 * @example
 * ```tsx
 * <KabooProvider references={[uploadProvider({ accept: "image/*,.pdf", onUpload })]} ...>
 * ```
 */
export function uploadProvider(config: UploadProviderConfig = {}): UploadReferenceProvider {
  return {
    id: config.id ?? "upload",
    label: config.label ?? "Upload",
    [UPLOAD_MARKER]: {
      kind: config.kind ?? "file",
      maxSize: config.maxSize ?? DEFAULT_MAX_SIZE,
      accept: config.accept,
      onUpload: config.onUpload,
    },
  };
}

/** Narrow a provider to an {@link UploadReferenceProvider}. */
export function isUploadProvider(
  provider: ReferenceProvider,
): provider is UploadReferenceProvider {
  return UPLOAD_MARKER in provider;
}

/**
 * Build a CopilotKit `AttachmentsConfig` from an upload config, wrapping
 * `onUpload` so every uploaded file carries kaboo id/kind/name in its
 * `InputContent` metadata. Pass to `<CopilotChat attachments={...}>` to use
 * CopilotKit's native attachment UI instead of the `@` composer.
 */
export function buildAttachmentsConfig(config: UploadProviderConfig = {}): AttachmentsConfig {
  const kind = config.kind ?? "file";
  return {
    enabled: true,
    accept: config.accept,
    maxSize: config.maxSize,
    onUpload: async (file: File): Promise<AttachmentUploadResult> => {
      const id = mintReferenceId(kind);
      const kabooMeta = {
        [REFERENCE_METADATA_KEYS.id]: id,
        [REFERENCE_METADATA_KEYS.kind]: kind,
        [REFERENCE_METADATA_KEYS.name]: file.name,
      };
      if (config.onUpload) {
        const result = await config.onUpload(file);
        return { ...result, metadata: { ...(result.metadata ?? {}), ...kabooMeta } };
      }
      const value = await readAsBase64(file);
      return {
        type: "data",
        value,
        mimeType: file.type || "application/octet-stream",
        metadata: kabooMeta,
      };
    },
  };
}
