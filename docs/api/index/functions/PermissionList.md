[**@pgege/kaboo-react**](../../README.md)

***

# Function: PermissionList()

> **PermissionList**(`__namedParameters`): `ReactElement`

Defined in: src/components/PermissionList.tsx:50

Presentational list of remembered approvals with a Revoke button each, for a
settings page or an assistant panel. The app loads the permissions (for
example with kaboo-runtime's `runner.listGrants`) and revokes them through
its own API; this component only renders.

## Parameters

### \_\_namedParameters

[`PermissionListProps`](../interfaces/PermissionListProps.md)

## Returns

`ReactElement`

## Example

```tsx
import { PermissionList } from "@pgege/kaboo-react";

function AssistantPermissions() {
  return (
    <PermissionList
      grants={[{ id: "g1", tool: "submit_report", label: "Submit reports", threadId: null }]}
      onRevoke={(id) => console.log("revoke", id)}
    />
  );
}
```
