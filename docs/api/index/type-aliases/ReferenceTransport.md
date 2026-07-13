[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: ReferenceTransport

> **ReferenceTransport** = `"attachment"` \| `"object"`

Defined in: [src/references/types.ts:31](https://github.com/gl-pgege/kaboo-react/blob/main/src/references/types.ts#L31)

How a reference reaches the agent.

- `attachment` — a file/blob (pdf, image, csv, …). Serialized as a CopilotKit
  `InputContent` part; its bytes are resolvable server-side. Files are the
  only blob-capable transport.
- `object` — a pointer to a custom entity (table, dashboard, ticket, …).
  Serialized into `state.kaboo_references`; resolved by the app's own MCP
  tool. Never carries bytes.
