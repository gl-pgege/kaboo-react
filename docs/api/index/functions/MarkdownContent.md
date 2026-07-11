[**kaboo-react**](../../README.md)

***

# Function: MarkdownContent()

> **MarkdownContent**(`__namedParameters`): `Element`

Defined in: [components/MarkdownContent.tsx:17](https://github.com/gl-pgege/kaboo-react/blob/ff0be174d037081f4a92375207a54f19f9aa8b43/src/components/MarkdownContent.tsx#L17)

Minimal, dependency-free markdown renderer used for agent text: supports
`#`/`##`/`###` headings, `-`/`*` list items, `**bold**` inline, and blank-line
spacing. Intentionally small — it is not a full CommonMark implementation.

## Parameters

### \_\_namedParameters

#### text

`string`

## Returns

`Element`

## Example

```tsx
import { MarkdownContent } from "kaboo-react";

function Example() {
  return <MarkdownContent text={"# Title\n\nSome **bold** text."} />;
}
```
