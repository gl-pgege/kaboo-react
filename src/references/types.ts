import type { ReactNode } from "react";

/**
 * Wire keys shared with kaboo-workflows. A file attachment carries its id/kind/
 * name in the CopilotKit `InputContent` part `metadata` under these keys; the
 * Python side reads the same keys back out. Kept snake_case so both stacks
 * agree without a translation layer.
 */
export const REFERENCE_METADATA_KEYS = {
  /** Metadata key carrying the reference id. */
  id: "kaboo_id",
  /** Metadata key carrying the reference kind. */
  kind: "kaboo_kind",
  /** Metadata key carrying the reference display name. */
  name: "kaboo_name",
} as const;

/** AG-UI `state` key under which object-transport references travel. */
export const REFERENCES_STATE_KEY = "kaboo_references";

/**
 * How a reference reaches the agent.
 *
 * - `attachment` — a file/blob (pdf, image, csv, …). Serialized as a CopilotKit
 *   `InputContent` part; its bytes are resolvable server-side. Files are the
 *   only blob-capable transport.
 * - `object` — a pointer to a custom entity (table, dashboard, ticket, …).
 *   Serialized into `state.kaboo_references`; resolved by the app's own MCP
 *   tool. Never carries bytes.
 */
export type ReferenceTransport = "attachment" | "object";

/**
 * One selectable item surfaced by a {@link ReferenceProvider} in the `@` menu.
 * `data` is provider-defined and threaded back to {@link ReferenceProvider.toReference}.
 */
export interface ReferenceItem<T = unknown> {
  /** Stable id for the underlying entity (provider scope). */
  id: string;
  /** Human label shown in the menu and used as the default mention chip text. */
  label: string;
  /** Optional secondary line (e.g. a path, table schema, owner). */
  description?: string;
  /** Provider-defined payload passed to {@link ReferenceProvider.toReference}. */
  data?: T;
}

/**
 * A reference that has been selected and is pending on the composer, before it
 * is serialized onto the outgoing message.
 */
export type PendingReference =
  | {
      /** Blob-capable transport discriminant. */
      transport: "attachment";
      /** Reference kind (e.g. `"file"`). */
      kind: string;
      /** Stable reference id, shared with the backend manifest. */
      id: string;
      /** File name shown on the chip. */
      name: string;
      /** MIME type of the file. */
      mimeType: string;
      /** Byte source: a fetchable URL, or inline base64. */
      source:
        | {
            /** A fetchable URL (preferred; keeps transport and log small). */
            url: string;
          }
        | {
            /** Inline base64 payload (fallback for small files). */
            data: string;
          };
    }
  | {
      /** Pointer-only transport discriminant. */
      transport: "object";
      /** Reference kind (e.g. `"table"`), resolved by your MCP tool. */
      kind: string;
      /** Stable reference id, shared with the backend manifest. */
      id: string;
      /** Label shown on the chip. */
      name: string;
      /** Arbitrary extra context threaded through to the resolver. */
      meta?: Record<string, unknown>;
    };

/**
 * A pluggable entry in the `@` reference menu. File upload ships as a built-in
 * provider (see `uploadProvider`); apps register their own for entities/actions
 * (tables, dashboards, tickets, …).
 *
 * A provider is either *searchable* (supplies {@link search} so its items list
 * live in the menu) or *action-only* (omits {@link search}; selecting its group
 * row runs {@link onSelect}, e.g. opening a file picker).
 */
export interface ReferenceProvider<T = unknown> {
  /** Stable provider id, e.g. `"upload" | "table" | "dashboard"`. */
  id: string;
  /** Group heading shown in the `@` menu. */
  label: string;
  /** Optional icon rendered beside the group heading. */
  icon?: ReactNode;
  /**
   * Return the items to list for the current query. Omit for an action-only
   * provider (its group row triggers {@link onSelect} directly).
   */
  search?: (query: string) => ReferenceItem<T>[] | Promise<ReferenceItem<T>[]>;
  /** Custom row renderer; falls back to `label` + `description`. */
  renderItem?: (item: ReferenceItem<T>) => ReactNode;
  /**
   * Side effect when an item (or the action-only group row) is chosen, e.g.
   * opening a file dialog or running an action. Called before {@link toReference}.
   */
  onSelect?: (item: ReferenceItem<T>) => void | Promise<void>;
  /**
   * How a chosen item serializes onto the message. Omit for pure actions that
   * produce their reference asynchronously (e.g. upload, via its own callback).
   */
  toReference?: (item: ReferenceItem<T>) => PendingReference;
}
