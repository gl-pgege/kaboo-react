const LABEL_KEYS = ["title", "name", "label", "id"];

export const TRUNCATED_KEY = "_truncated";

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
    const entries = Object.entries(value).filter(([key, item]) => key !== TRUNCATED_KEY && item != null && item !== "");
    if (depth < 1) return entries.map(([key, item]) => `${key.replace(/_/g, " ")}: ${describeValue(item, depth + 1)}`).join(", ");
    return `${entries.length} field${entries.length === 1 ? "" : "s"}`;
  }
  return String(value);
}

function rowSource(value: Record<string, unknown>): Record<string, unknown> {
  const content = value.untrusted_content;
  return isRecord(content) && Array.isArray(content.rows) ? content : value;
}

function isCutList(value: Record<string, unknown>): boolean {
  return Array.isArray(value.items) && Object.keys(value).every((key) => key === "items" || key === TRUNCATED_KEY);
}

export function tableRows(value: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isRecord) ? value : null;
  }
  if (!isRecord(value)) return null;
  if (isCutList(value)) return tableRows(value.items);
  const source = rowSource(value);
  const { rows } = source;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const columns = source.columns ?? value.columns;
  if (Array.isArray(columns) && rows.every(Array.isArray)) {
    return rows.map((row) => Object.fromEntries(columns.map((column, index) => [String(column), row[index]])));
  }
  return rows.every(isRecord) ? rows : null;
}

function truncatedCount(marker: unknown): number {
  if (typeof marker === "number") return marker;
  if (!isRecord(marker)) return 0;
  if (typeof marker.rows === "number") return marker.rows;
  return typeof marker.items === "number" ? marker.items : 0;
}

export function truncatedRows(value: unknown): number {
  if (!isRecord(value)) return 0;
  const source = rowSource(value);
  return truncatedCount(source[TRUNCATED_KEY]) + (source === value ? 0 : truncatedCount(value[TRUNCATED_KEY]));
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
