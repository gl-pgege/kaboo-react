import { createElement, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import { Streamdown, type StreamdownProps } from "streamdown";
import { useRenderOptions } from "../context/ToolRenderers";

type ElementProps = HTMLAttributes<HTMLElement> & { node?: unknown };

function element(tag: string, className?: string) {
  return function MarkdownElement({ node: _node, className: _className, ...props }: ElementProps) {
    return createElement(tag, { ...props, className });
  };
}

function Link({ node: _node, className: _className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) {
  return <a {...props} className="kaboo-md-a" target="_blank" rel="noreferrer" />;
}

function Table({ node: _node, className: _className, ...props }: ElementProps) {
  return (
    <div className="kaboo-md-table-wrap">
      <table {...props} className="kaboo-md-table" />
    </div>
  );
}

const COMPONENTS: StreamdownProps["components"] = {
  h1: element("h2", "kaboo-md-h2"),
  h2: element("h3", "kaboo-md-h3"),
  h3: element("h4", "kaboo-md-h4"),
  h4: element("h4", "kaboo-md-h4"),
  h5: element("h4", "kaboo-md-h4"),
  h6: element("h4", "kaboo-md-h4"),
  p: element("p", "kaboo-md-p"),
  ul: element("ul", "kaboo-md-ul"),
  ol: element("ol", "kaboo-md-ol"),
  li: element("li", "kaboo-md-li"),
  strong: element("strong", "kaboo-md-strong"),
  blockquote: element("blockquote", "kaboo-md-quote"),
  hr: element("hr", "kaboo-md-hr"),
  pre: element("pre", "kaboo-md-pre"),
  code: element("code", "kaboo-md-code"),
  img: element("img", "kaboo-md-img"),
  a: Link,
  table: Table,
  thead: element("thead"),
  tbody: element("tbody"),
  tr: element("tr"),
  th: element("th", "kaboo-md-th"),
  td: element("td", "kaboo-md-td"),
};

const DANGLING_MARKER = /(^|\s)[*_~`]+$/;

/**
 * Renders agent markdown as GitHub-flavored markdown (tables, lists, code,
 * links) with Streamdown, so text that is still streaming never shows its
 * unclosed markers. A `markdownRenderer` on {@link KabooProvider} replaces it.
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
  const { markdownRenderer } = useRenderOptions();
  if (markdownRenderer) return <>{markdownRenderer(text)}</>;
  return (
    <Streamdown className="kaboo-md" components={COMPONENTS}>
      {text.trimEnd().replace(DANGLING_MARKER, "$1")}
    </Streamdown>
  );
}
