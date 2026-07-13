[**@pgege/kaboo-react**](../../README.md)

***

# Function: KabooReferenceInput()

> **KabooReferenceInput**(`__namedParameters`): `Element`

Defined in: [src/references/ReferenceInput.tsx:148](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/ReferenceInput.tsx#L148)

A `<CopilotChat input={…}>` slot that keeps CopilotKit's native input chrome
(send button, disclaimer, theme, layout) but replaces the plain textarea with
a lightweight rich editor. References — your objects (via `@`) and files (via
the `+` button or the "attach a file" row) — render as interactive inline
chips: click a chip to swap it for another, or its `×` to remove it. The `+`
and `@` triggers open the *same* searchable popover. Object references ride
`state.kaboo_references` (agent sees them inline as `@name`); files ride the
message as attachment parts (agent is made aware via the manifest). On submit
the editor builds the multimodal message and runs the agent.

## Parameters

### \_\_namedParameters

[`KabooReferenceInputProps`](../interfaces/KabooReferenceInputProps.md)

## Returns

`Element`

## Example

```tsx
<KabooProvider references={[uploadProvider({ onUpload }), tableProvider]} …>
  <CopilotChat input={KabooReferenceInput} />
</KabooProvider>
```
