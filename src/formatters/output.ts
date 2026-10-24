import { describeValue, isRecord, parseToolValue, tableRows } from "./value";

/**
 * Parses a raw tool result into a renderable shape: `rows` (for tabular JSON —
 * `{ rows: [...] }`, a query page `{ columns, rows }`, or a top-level array of
 * objects) or `text` (a `key: value` rendering of an object that reads as text,
 * never JSON, or the raw string when it isn't JSON).
 *
 * @example
 * ```ts
 * import { formatToolResult } from "@pgege/kaboo-react";
 *
 * const { rows } = formatToolResult('{"rows":[{"id":"1"}]}');
 * // rows?.length === 1
 * ```
 */
export function formatToolResult(raw: string): {
  /** Row-shaped result for a table view, or `null` when not tabular. */
  rows: Record<string, string>[] | null;
  /** Text rendering of the result when it is not tabular. */
  text: string;
} {
  const parsed = parseToolValue(raw);
  if (parsed === undefined) return { rows: null, text: raw };
  const rows = tableRows(parsed);
  if (rows) return { rows: rows as Record<string, string>[], text: "" };
  if (isRecord(parsed)) {
    const entries = Object.entries(parsed)
      .filter(([, v]) => v != null)
      .map(([k, v]) => `${k}: ${describeValue(v)}`);
    return { rows: null, text: entries.join("\n") };
  }
  return { rows: null, text: describeValue(parsed) };
}

function unwrapJson(raw: unknown): unknown {
  let value: unknown = raw;
  for (let i = 0; i < 2 && typeof value === "string"; i++) {
    const trimmed = (value as string).trim();
    if (trimmed === "") return value;
    try {
      value = JSON.parse(trimmed);
    } catch {
      break;
    }
  }
  return value;
}

function statusIsCancelled(status: unknown): boolean {
  if (typeof status !== "string") return false;
  const s = status.toLowerCase();
  return s === "cancelled" || s === "canceled" || s === "rejected" || s === "declined";
}

function statusIsControl(status: unknown): boolean {
  if (typeof status !== "string") return false;
  const s = status.toLowerCase();
  return statusIsCancelled(status) || s === "approved" || s === "accepted";
}

const REFUSAL_NOTES = [
  /user rejected this action/i,
  /(user|person) declined to answer/i,
  /person skipped this question/i,
  /^\s*"?(Declined|Skipped|Expired)\b[:.]/,
];

/**
 * True when a tool result signals that the person did not approve or answer
 * rather than real output — a gate's "Declined", "Skipped" or "Expired" note,
 * the ask_user decline or skip note, or a bare HITL control payload like
 * `{"status":"cancelled"}` (tolerating one extra layer of string encoding).
 * Used to render a "cancelled" state instead of "done".
 */
export function isCancelledResult(raw: unknown): boolean {
  if (raw == null) return false;
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  if (REFUSAL_NOTES.some((note) => note.test(text))) return true;
  const value = unwrapJson(text);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return statusIsCancelled((value as Record<string, unknown>).status);
  }
  return false;
}

const CONTROL_KEYS = new Set(["status", "scope", "reason", "skipped", "expired", "tool_input"]);

/**
 * True when a result is ONLY a HITL control payload — an interrupt-resolution
 * echo like `{"status":"approved","scope":"thread"}` or
 * `{"status":"cancelled","reason":"…"}` — with no real tool output. The owning
 * agent's card already shows the gated action in order, so the inline wildcard
 * renderer and the card skip this stray raw payload rather than dumping JSON.
 */
export function isControlOnlyStatus(raw: unknown): boolean {
  if (raw == null) return false;
  const value = unwrapJson(typeof raw === "string" ? raw : JSON.stringify(raw));
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value as Record<string, unknown>);
    return keys.includes("status") && keys.every((k) => CONTROL_KEYS.has(k)) &&
      statusIsControl((value as Record<string, unknown>).status);
  }
  return false;
}

/**
 * Normalizes a raw result string for display: unwraps one layer of JSON string
 * encoding, converts escaped `\n` into real newlines, and returns `null` for
 * empty/undefined input.
 *
 * @example
 * ```ts
 * import { normalizeResult } from "@pgege/kaboo-react";
 *
 * normalizeResult('"line one\\nline two"');
 * // "line one\nline two"
 * ```
 */
export function normalizeResult(result: string | undefined): string | null {
  if (!result) return null;
  let text = typeof result === "string" ? result : JSON.stringify(result, null, 2);
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      text = JSON.parse(text);
    } catch { /* keep as-is */ }
  }
  text = text.replace(/\\n/g, "\n");
  return text || null;
}
