[**@pgege/kaboo-react**](../../README.md)

***

# Function: toFormQuestion()

> **toFormQuestion**(`raw`): [`FormQuestion`](../interfaces/FormQuestion.md)

Defined in: [src/formatters/askUser.ts:27](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/askUser.ts#L27)

Read one question as the card renders it. Missing options become an empty
list, a free-text question answered through Other alone.

## Parameters

### raw

#### multiple?

`boolean`

#### options?

`string`[]

#### question?

`string`

## Returns

[`FormQuestion`](../interfaces/FormQuestion.md)

## Example

```ts
import { toFormQuestion } from "@pgege/kaboo-react";

toFormQuestion({ question: "Which sectors?", options: ["B2B", "B2C"], multiple: true });
// { question: "Which sectors?", options: ["B2B", "B2C"], multiple: true }
```
