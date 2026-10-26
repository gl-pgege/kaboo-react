[**@pgege/kaboo-react**](../../README.md)

***

# Function: MarkdownContent()

> **MarkdownContent**(`__namedParameters`): `Element`

Defined in: [src/components/MarkdownContent.tsx:67](https://github.com/gl-pgege/kaboo-react/blob/main/src/components/MarkdownContent.tsx#L67)

Renders agent markdown as GitHub-flavored markdown (tables, lists, code,
links) with Streamdown, so text that is still streaming never shows its
unclosed markers. A `markdownRenderer` on [KabooProvider](KabooProvider.md) replaces it.

## Parameters

### \_\_namedParameters

#### text

`string`

## Returns

`Element`

## Example

```tsx
import { MarkdownContent } from "@pgege/kaboo-react";

function Example() {
  return <MarkdownContent text={"# Title\n\nSome **bold** text."} />;
}
```
