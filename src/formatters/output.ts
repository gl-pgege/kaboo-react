export function formatToolResult(raw: string): { rows: Record<string, string>[] | null; text: string } {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.rows && Array.isArray(parsed.rows) && parsed.rows.length > 0) {
      return { rows: parsed.rows as Record<string, string>[], text: "" };
    }
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
      return { rows: parsed as Record<string, string>[], text: "" };
    }
    if (typeof parsed === "object" && parsed !== null) {
      const entries = Object.entries(parsed as Record<string, unknown>)
        .filter(([, v]) => v != null)
        .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`);
      return { rows: null, text: entries.join("\n") };
    }
    return { rows: null, text: String(parsed) };
  } catch {
    return { rows: null, text: raw };
  }
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

/**
 * True when a tool result signals a human rejection/decline rather than real
 * output — the gated-tool reject message, the ask_user decline note, or a bare
 * HITL control payload like `{"status":"cancelled"}` (tolerating one extra layer
 * of string encoding). Used to render a "cancelled" state instead of "done".
 */
export function isCancelledResult(raw: unknown): boolean {
  if (raw == null) return false;
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  if (/user rejected this action/i.test(text)) return true;
  if (/user declined to answer/i.test(text)) return true;
  const value = unwrapJson(text);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return statusIsCancelled((value as Record<string, unknown>).status);
  }
  return false;
}

/**
 * True when a result is ONLY a HITL control payload (a lone `status` field
 * carrying an interrupt-resolution echo like `{"status":"approved"}` or
 * `{"status":"cancelled"}`), with no real tool output. The owning agent's card
 * already shows the gated action in order, so the inline wildcard renderer and
 * the card skip this stray raw payload rather than dumping JSON.
 */
export function isControlOnlyStatus(raw: unknown): boolean {
  if (raw == null) return false;
  const value = unwrapJson(typeof raw === "string" ? raw : JSON.stringify(raw));
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value as Record<string, unknown>);
    return keys.length === 1 && keys[0] === "status" &&
      statusIsControl((value as Record<string, unknown>).status);
  }
  return false;
}

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
