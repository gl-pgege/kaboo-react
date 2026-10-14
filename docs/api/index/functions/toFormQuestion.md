[**@pgege/kaboo-react**](../../README.md)

***

# Function: toFormQuestion()

> **toFormQuestion**(`raw`): [`FormQuestion`](../interfaces/FormQuestion.md)

Defined in: [src/formatters/askUser.ts:32](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/askUser.ts#L32)

Read one question in either shape: `multiple` wins, the deprecated `type`
(`checkbox`) is honoured when it is absent, and missing options become an
empty list (a pre-0.27 free-text question, answered through Other alone).

## Parameters

### raw

#### multiple?

`boolean`

#### options?

`string`[]

#### question?

`string`

#### type?

`"text"` \| `"radio"` \| `"checkbox"`

## Returns

[`FormQuestion`](../interfaces/FormQuestion.md)

## Example

```ts
import { toFormQuestion } from "@pgege/kaboo-react";

toFormQuestion({ question: "Which sectors?", type: "checkbox", options: ["B2B", "B2C"] });
// { question: "Which sectors?", options: ["B2B", "B2C"], multiple: true }
```
