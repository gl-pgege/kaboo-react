const LABEL_KEYS = ["title", "name", "label", "id"];

function labelOf(value: Record<string, unknown>): string | undefined {
  for (const key of LABEL_KEYS) {
    const label = value[key];
    if (typeof label === "string" && label) return label;
  }
  return undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function describeValue(value: unknown, depth = 0): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "none";
    const parts = value.map((item) => (isRecord(item) ? labelOf(item) : depth < 1 ? describeValue(item, depth + 1) : undefined));
    if (parts.every((part) => part)) return parts.join(", ");
    return `${value.length} item${value.length === 1 ? "" : "s"}`;
  }
  if (isRecord(value)) {
    const label = labelOf(value);
    if (label) return label;
    const entries = Object.entries(value).filter(([, item]) => item != null && item !== "");
    if (depth < 1) return entries.map(([key, item]) => `${key.replace(/_/g, " ")}: ${describeValue(item, depth + 1)}`).join(", ");
    return `${entries.length} field${entries.length === 1 ? "" : "s"}`;
  }
  return String(value);
}

export function tableRows(value: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isRecord) ? value : null;
  }
  if (!isRecord(value) || !Array.isArray(value.rows) || value.rows.length === 0) return null;
  const { columns, rows } = value;
  if (Array.isArray(columns) && rows.every(Array.isArray)) {
    return rows.map((row) => Object.fromEntries(columns.map((column, index) => [String(column), row[index]])));
  }
  return rows.every(isRecord) ? rows : null;
}

export function toolTitle(name: string): string {
  const words = (name.split("___").pop() ?? name).replace(/[_-]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : name;
}

export function parseToolValue(raw: string): unknown {
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch {
    return undefined;
  }
}
