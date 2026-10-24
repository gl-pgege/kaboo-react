[**@pgege/kaboo-react**](../../README.md)

***

# Function: withSubagentLabel()

> **withSubagentLabel**\<`T`\>(`renderer`): `ReactActivityMessageRenderer`\<`T`\>

Defined in: [src/integrations/withSubagentLabel.tsx:32](https://github.com/gl-pgege/kaboo-react/blob/main/src/integrations/withSubagentLabel.tsx#L32)

Label a generative UI surface with the sub-agent that rendered it, as the
sub-agent's questions are labelled. Wrap the activity renderer passed to
`renderActivityMessages`; surfaces from the agent answering the chat stay
unlabelled.

## Type Parameters

### T

`T`

## Parameters

### renderer

`ReactActivityMessageRenderer`\<`T`\>

## Returns

`ReactActivityMessageRenderer`\<`T`\>

## Example

```tsx
import { createA2UIMessageRenderer } from "@copilotkit/react-core/v2";
import { withSubagentLabel } from "@pgege/kaboo-react/copilotkit";

const renderers = [withSubagentLabel(createA2UIMessageRenderer({ theme }))];
```
