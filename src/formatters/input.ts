export function formatToolInput(input: unknown): { summary: string; detail: string | null } {
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
