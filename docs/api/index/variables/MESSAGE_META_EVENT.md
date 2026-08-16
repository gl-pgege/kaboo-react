[**@pgege/kaboo-react**](../../README.md)

***

# Variable: MESSAGE\_META\_EVENT

> `const` **MESSAGE\_META\_EVENT**: `"kaboo.message_meta"` = `"kaboo.message_meta"`

Defined in: [src/context/MessageMeta.tsx:9](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/MessageMeta.tsx#L9)

Name of the `CUSTOM` event carrying per-message metadata, emitted by
kaboo-runtime once per new input message of a run. The payload is
`{ messageId, role, createdAt, references }`.
