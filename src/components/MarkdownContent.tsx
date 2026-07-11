import type { ReactNode } from "react";

/**
 * Minimal, dependency-free markdown renderer used for agent text: supports
 * `#`/`##`/`###` headings, `-`/`*` list items, `**bold**` inline, and blank-line
 * spacing. Intentionally small — it is not a full CommonMark implementation.
 *
 * @example
 * ```tsx
 * import { MarkdownContent } from "@pgege/kaboo-react";
 *
 * function Example() {
 *   return <MarkdownContent text={"# Title\n\nSome **bold** text."} />;
 * }
 * ```
 */
export function MarkdownContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="kaboo-md">
      {lines.map((line, i) => {
        if (line.startsWith("# ") && !line.startsWith("## ")) {
          return <h2 key={i} className="kaboo-md-h2">{line.slice(2)}</h2>;
        }
        if (line.startsWith("## ")) {
          return <h3 key={i} className="kaboo-md-h3">{line.slice(3)}</h3>;
        }
        if (line.startsWith("### ")) {
          return <h4 key={i} className="kaboo-md-h4">{line.slice(4)}</h4>;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return <li key={i} className="kaboo-md-li">{renderInline(line.slice(2))}</li>;
        }
        if (line.trim() === "") {
          return <div key={i} className="kaboo-md-spacer" />;
        }
        return <p key={i} className="kaboo-md-p">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts: (string | ReactNode)[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }
    parts.push(remaining);
    break;
  }

  return <>{parts}</>;
}
