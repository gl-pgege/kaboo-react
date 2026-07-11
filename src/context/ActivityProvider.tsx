import { useState, useEffect, createContext, type ReactNode, type ReactElement } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import type { ActivityState } from "../types";

const EMPTY: ActivityState = { groups: {} };

/**
 * A map of custom renderers for structured agent output, keyed by the output
 * schema name. When a group carries `structuredOutput` and a matching
 * `outputSchemaName`, its renderer is used instead of the default JSON view.
 *
 * @example
 * ```tsx
 * import type { StructuredRenderers } from "@kaboo/react";
 *
 * const renderers: StructuredRenderers = {
 *   WeatherReport: (data) => <div>{String(data.summary)}</div>,
 * };
 * ```
 */
export type StructuredRenderers = Record<string, (data: Record<string, unknown>) => ReactElement>;

/** React context carrying the raw activity snapshot; read it via {@link useActivity}. */
export const ActivityContext = createContext<ActivityState>(EMPTY);
/** React context carrying the {@link StructuredRenderers} map for structured output. */
export const StructuredRenderersContext = createContext<StructuredRenderers>({});

/** Props for {@link KabooActivityProvider}. */
export interface KabooActivityProviderProps {
  /**
   * CopilotKit agent id whose activity snapshots to consume. Omit to use the
   * provider's default agent. Agent and thread scoping come from CopilotKit.
   */
  agentId?: string;
  /** Renderers for structured agent outputs, keyed by output schema name. */
  structuredRenderers?: StructuredRenderers;
  /** The subtree that reads activity via {@link useActivity}. */
  children: ReactNode;
}

/**
 * Reads kaboo's hierarchical activity from the AG-UI run stream. The backend
 * emits it as `ACTIVITY_SNAPSHOT` events interleaved on `/invocations`, so we
 * subscribe to the CopilotKit agent instead of a separate SSE endpoint.
 *
 * Included automatically by {@link KabooProvider}; mount it yourself only when
 * composing providers by hand under an existing `<CopilotKit>`.
 *
 * @example
 * ```tsx
 * import { KabooActivityProvider, ActivityPanel } from "@kaboo/react";
 *
 * function Activity({ agent }: { agent: string }) {
 *   return (
 *     <KabooActivityProvider agentId={agent}>
 *       <ActivityPanel />
 *     </KabooActivityProvider>
 *   );
 * }
 * ```
 */
export function KabooActivityProvider({ agentId, structuredRenderers, children }: KabooActivityProviderProps) {
  const { agent } = useAgent(agentId ? { agentId } : undefined);
  const [state, setState] = useState<ActivityState>(EMPTY);

  useEffect(() => {
    if (!agent) return;
    const { unsubscribe } = agent.subscribe({
      onActivitySnapshotEvent: ({ event }) => {
        setState(event.content as unknown as ActivityState);
      },
    });
    return unsubscribe;
  }, [agent]);

  return (
    <ActivityContext.Provider value={state}>
      <StructuredRenderersContext.Provider value={structuredRenderers ?? {}}>
        {children}
      </StructuredRenderersContext.Provider>
    </ActivityContext.Provider>
  );
}
