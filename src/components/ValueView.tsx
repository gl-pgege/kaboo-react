import { describeValue, isRecord, tableRows } from "../formatters/value";
import { MiniTable } from "./MiniTable";

const CODE_KEYS = new Set(["sql", "query", "code", "script", "markdown"]);

function isCode(key: string | undefined, value: unknown): value is string {
  return typeof value === "string" && ((key !== undefined && CODE_KEYS.has(key)) || value.includes("\n"));
}

export function ValueView({ value, name, depth = 0 }: { value: unknown; name?: string; depth?: number }) {
  if (isCode(name, value)) return <pre className="kaboo-value-code">{value.trim()}</pre>;
  const rows = tableRows(value);
  if (rows) return <MiniTable rows={rows} />;
  if (isRecord(value) && depth < 2) {
    const entries = Object.entries(value).filter(([, item]) => item != null && item !== "");
    return (
      <dl className="kaboo-value-list">
        {entries.map(([key, item]) => (
          <div key={key} className="kaboo-value-row">
            <dt>{key.replace(/_/g, " ")}</dt>
            <dd>
              <ValueView value={item} name={key} depth={depth + 1} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return <span>{describeValue(value)}</span>;
}
