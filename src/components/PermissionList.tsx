import type { ReactElement } from "react";

/**
 * A remembered approval, as a host lists it (kaboo-runtime's `ToolGrant`
 * matches this shape).
 */
export interface RememberedPermission {
  /** Id used to revoke it. */
  id: string;
  /** The gated tool. */
  tool: string;
  /** Human label for what it covers. */
  label: string;
  /** The conversation it applies to, or `null` for every conversation. */
  threadId: string | null;
  /** When it was granted, epoch milliseconds. */
  createdAt?: number;
}

/** Props for {@link PermissionList}. */
export interface PermissionListProps {
  /** The permissions to show, in display order. */
  grants: RememberedPermission[];
  /** Called with a permission's id when the person revokes it. */
  onRevoke: (id: string) => void;
  /** Text shown when there is nothing to list. */
  emptyText?: string;
}

/**
 * Presentational list of remembered approvals with a Revoke button each, for a
 * settings page or an assistant panel. The app loads the permissions (for
 * example with kaboo-runtime's `runner.listGrants`) and revokes them through
 * its own API; this component only renders.
 *
 * @example
 * ```tsx
 * import { PermissionList } from "@pgege/kaboo-react";
 *
 * function AssistantPermissions() {
 *   return (
 *     <PermissionList
 *       grants={[{ id: "g1", tool: "submit_report", label: "Submit reports", threadId: null }]}
 *       onRevoke={(id) => console.log("revoke", id)}
 *     />
 *   );
 * }
 * ```
 */
export function PermissionList({
  grants,
  onRevoke,
  emptyText = "No remembered permissions.",
}: PermissionListProps): ReactElement {
  if (grants.length === 0) {
    return <p className="kaboo-permissions-empty">{emptyText}</p>;
  }
  return (
    <ul className="kaboo-permissions">
      {grants.map((grant) => (
        <li key={grant.id} className="kaboo-permission">
          <span className="kaboo-permission-label">{grant.label}</span>
          <span className="kaboo-permission-scope">
            {grant.threadId === null ? "Always" : "This chat"}
          </span>
          <button
            className="kaboo-interrupt-btn kaboo-permission-revoke"
            onClick={() => onRevoke(grant.id)}
            aria-label={`Revoke ${grant.label}`}
          >
            Revoke
          </button>
        </li>
      ))}
    </ul>
  );
}
