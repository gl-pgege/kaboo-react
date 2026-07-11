/**
 * Condenses arbitrary tool input into a short one-line `summary` for a tool row.
 * Prefers well-known fields (`query`/`table_name`/`url`), unwraps single-key
 * objects, and otherwise joins `key: value` pairs. `detail` is reserved for
 * future expansion and is currently always `null`.
 *
 * @example
 * ```ts
 * import { formatToolInput } from "@kaboo/react";
 *
 * const { summary } = formatToolInput({ query: "select 1" });
 * // summary === "select 1"
 * ```
 */
export function formatToolInput(input: unknown): {
  /** One-line summary suitable for a tool row. */
  summary: string;
  /** Reserved for future detail expansion; currently always `null`. */
  detail: string | null;
} {
  if (input == null) return { summary: "", detail: null };
  if (typeof input === "string") return { summary: input, detail: null };

  const obj = input as Record<string, unknown>;

  if (obj.query && typeof obj.query === "string") {
    return { summary: String(obj.query).trim(), detail: null };
  }
  if (obj.table_name && typeof obj.table_name === "string") {
    return { summary: obj.table_name as string, detail: null };
  }
  if (obj.url && typeof obj.url === "string") {
    return { summary: obj.url as string, detail: null };
  }

  const keys = Object.keys(obj);
  if (keys.length === 1) {
    const val = obj[keys[0]];
    return { summary: typeof val === "string" ? val : JSON.stringify(val), detail: null };
  }

  const parts = keys
    .filter((k) => obj[k] != null && obj[k] !== "")
    .map((k) => {
      const v = obj[k];
      return `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`;
    });
  return { summary: parts.join(", "), detail: null };
}
