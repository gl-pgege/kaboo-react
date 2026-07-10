import type { ReactNode } from "react";
import { KabooActivityProvider, type StructuredRenderers } from "./ActivityProvider";
import { DrillProvider } from "./DrillContext";
import { InterruptBridgeProvider } from "./InterruptBridge";

export interface KabooProviderProps {
  /** URL of the server's activity SSE endpoint (e.g. `/api/activity-stream`). */
  activityUrl: string;
  /** Entry agent name — its own group is hidden from the activity view. */
  entryAgent?: string;
  /** Conversation id to scope the activity stream to (multi-tenant). */
  threadId?: string;
  /** Renderers for structured agent outputs, keyed by output schema name. */
  structuredRenderers?: StructuredRenderers;
  children: ReactNode;
}

/**
 * One provider that composes every kaboo-react context in the correct order:
 * activity → drill → interrupt bridge. Drop this once near the root instead of
 * hand-nesting the providers.
 */
export function KabooProvider({
  activityUrl,
  entryAgent,
  threadId,
  structuredRenderers,
  children,
}: KabooProviderProps) {
  return (
    <KabooActivityProvider
      url={activityUrl}
      entryAgent={entryAgent}
      threadId={threadId}
      structuredRenderers={structuredRenderers}
    >
      <DrillProvider>
        <InterruptBridgeProvider>{children}</InterruptBridgeProvider>
      </DrillProvider>
    </KabooActivityProvider>
  );
}
