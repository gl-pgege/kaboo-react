/**
 * Compact table for row-shaped tool results. Columns are inferred from the first
 * row's keys; underscores in headers become spaces. Renders at most `maxRows`
 * rows with a "+N more" footer, and nothing at all for an empty list.
 *
 * @example
 * ```tsx
 * import { MiniTable } from "@kaboo/react";
 *
 * function Example() {
 *   return <MiniTable rows={[{ id: "1", name: "Ada" }]} maxRows={5} />;
 * }
 * ```
 */
export function MiniTable({ rows, maxRows = 8 }: { rows: Record<string, string>[]; maxRows?: number }) {
  if (rows.length === 0) return null;
  const cols = Object.keys(rows[0]);
  const display = rows.slice(0, maxRows);
  const remaining = rows.length - maxRows;

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="kaboo-mini-table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>{c.replace(/_/g, " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {display.map((row, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c}>{String(row[c] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {remaining > 0 && (
        <div className="kaboo-mini-table-overflow">
          +{remaining} more row{remaining !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
