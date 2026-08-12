import { createContext, useContext } from "react";
import type { MessageMeta } from "../types";

/**
 * Name of the `CUSTOM` event carrying per-message metadata, emitted by
 * kaboo-runtime once per new input message of a run. The payload is
 * `{ messageId, role, createdAt, references }`.
 */
export const MESSAGE_META_EVENT = "kaboo.message_meta";

/**
 * React context carrying {@link MessageMeta} keyed by message id. Populated by
 * {@link KabooActivityProvider} from the AG-UI event stream; read it via
 * {@link useMessageMeta}.
 */
export const MessageMetaContext = createContext<Record<string, MessageMeta>>({});

/**
 * Read the per-message metadata map (timestamps and per-message references)
 * recovered from the run's event stream. Keys are message ids; entries exist
 * only for messages whose events carried metadata, so always handle absence.
 *
 * @example
 * ```tsx
 * import { useMessageMeta } from "@pgege/kaboo-react";
 *
 * function SentAt({ messageId }: { messageId: string }) {
 *   const meta = useMessageMeta()[messageId];
 *   return meta?.createdAt ? <time>{new Date(meta.createdAt).toLocaleTimeString()}</time> : null;
 * }
 * ```
 */
export function useMessageMeta(): Record<string, MessageMeta> {
  return useContext(MessageMetaContext);
}
