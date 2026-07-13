[**@pgege/kaboo-react**](../../README.md)

***

# Function: mintReferenceId()

> **mintReferenceId**(`kind`): `string`

Defined in: [src/references/serialize.ts:15](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/serialize.ts#L15)

Mint a stable reference id. Client-minted so the same id travels in the
message/state AND is what the agent later reads from the manifest and passes
to a tool. Prefixed by kind for readability in logs/manifests.

## Parameters

### kind

`string`

## Returns

`string`
