[**@pgege/kaboo-react**](../../README.md)

***

# Interface: ReferencesProviderProps

Defined in: src/references/ReferencesProvider.tsx:49

Props for [ReferencesProvider](../functions/ReferencesProvider.md).

## Properties

### children

> **children**: `ReactNode`

Defined in: src/references/ReferencesProvider.tsx:60

The subtree that can stage and read references.

***

### providers?

> `optional` **providers?**: [`ReferenceProvider`](ReferenceProvider.md)\<`unknown`\>[]

Defined in: src/references/ReferencesProvider.tsx:51

The `@` provider registry. File upload is not implicit — pass `uploadProvider()`.

***

### syncObjectStateTo?

> `optional` **syncObjectStateTo?**: `string` \| `false`

Defined in: src/references/ReferencesProvider.tsx:58

Sync staged object-transport references into the bound agent's
`state.kaboo_references` as they change, so a plain `<CopilotChat>` send
still carries them. Default `true`. Attachment references travel on the
message itself and are unaffected.
