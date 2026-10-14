[**@pgege/kaboo-react**](../../README.md)

***

# Function: buildAnswerPayload()

> **buildAnswerPayload**(`questions`, `answers`): `Record`\<`string`, `string` \| `string`[]\>

Defined in: [src/formatters/askUser.ts:91](https://github.com/gl-pgege/kaboo-react/blob/main/src/formatters/askUser.ts#L91)

Build the answer a question card sends back: a `{question: answer}` map,
with a list for a multi-select question and the person's own words for
Other. It is the single representation the model reads (as JSON) and the
answered Q&A card parses, keyed by question text so neither needs extra
correlation state. Custom question cards use it to send the same answer.

## Parameters

### questions

[`FormQuestion`](../interfaces/FormQuestion.md)[]

The questions, in order.

### answers

`Record`\<`number`, `string` \| `string`[] \| `undefined`\>

The answers, by question index.

## Returns

`Record`\<`string`, `string` \| `string`[]\>

The payload for `onResolve`.

## Example

```ts
import { buildAnswerPayload } from "@pgege/kaboo-react";

buildAnswerPayload(
  [{ question: "Which market?", options: ["AI", "Cloud"] }],
  { 0: "Robotics" },
);
// { "Which market?": "Robotics" }
```
