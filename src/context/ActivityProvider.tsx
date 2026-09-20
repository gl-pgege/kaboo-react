import { useState, useEffect, createContext, type ReactNode, type ReactElement } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import type { ActivityState, MessageMeta, StreamGroup } from "../types";
import { MessageMetaContext, MESSAGE_META_EVENT } from "./MessageMeta";
import { applyActivityPatch } from "../utils/activityPatch";

const EMPTY: ActivityState = { groups: {} };

/**
 * Settle any group a finished run left `"active"` to `"stopped"`, so aborted
 * or errored runs never leave cards spinning "working..." forever. Identity is
 * preserved when nothing was active, avoiding a render.
 */
function settleActiveGroups(state: ActivityState): ActivityState {
  let changed = false;
  const groups: Record<string, StreamGroup> = {};
  for (const [id, g] of Object.entries(state.groups)) {
    if (g.status === "active") {
      groups[id] = { ...g, status: "stopped" };
      changed = true;
    } else {
      groups[id] = g;
    }
  }
  return changed ? { ...state, groups } : state;
}

/**
 * A map of custom renderers for structured agent output, keyed by the output
 * schema name. When a group carries `structuredOutput` and a matching
 * `outputSchemaName`, its renderer is used instead of the default JSON view.
 *
 * @example
 * ```tsx
 * import type { StructuredRenderers } from "@pgege/kaboo-react";
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
 * import { KabooActivityProvider, ActivityPanel } from "@pgege/kaboo-react";
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
  const [messageMeta, setMessageMeta] = useState<Record<string, MessageMeta>>({});

  useEffect(() => {
    if (!agent) return;
    // The run enclosing the events currently streaming. Tracked from the
    // events themselves (not CopilotKit's request-scoped runId) so message
    // attribution is identical live and on replay, where one connect request
    // carries many historical runs.
    let currentRunId: string | undefined;
    const recordRunId = (messageId: string | undefined) => {
      const runId = currentRunId;
      if (!messageId || !runId) return;
      setMessageMeta((prev) =>
        prev[messageId]?.runId === runId
          ? prev
          : { ...prev, [messageId]: { ...prev[messageId], runId } },
      );
    };
    const { unsubscribe } = agent.subscribe({
      onActivitySnapshotEvent: ({ event }) => {
        setState(event.content as unknown as ActivityState);
      },
      // Each response opens with a snapshot and then patches it, so the tree is
      // sent once rather than re-sent on every change.
      onActivityDeltaEvent: ({ event }) => {
        setState((prev) => applyActivityPatch(prev, (event as { patch?: unknown }).patch));
      },
      onRunStartedEvent: ({ event }) => {
        currentRunId = (event as { runId?: string }).runId;
      },
      onToolCallStartEvent: ({ event }) => {
        recordRunId((event as { parentMessageId?: string }).parentMessageId);
      },
      onCustomEvent: ({ event }) => {
        if (event.name !== MESSAGE_META_EVENT) return;
        const value = event.value as
          | { messageId?: string; createdAt?: number; references?: unknown[] }
          | undefined;
        const messageId = value?.messageId;
        if (!messageId) return;
        setMessageMeta((prev) => ({
          ...prev,
          [messageId]: {
            ...prev[messageId],
            ...(typeof value?.createdAt === "number" ? { createdAt: value.createdAt } : {}),
            ...(Array.isArray(value?.references) ? { references: value.references } : {}),
          },
        }));
      },
      onTextMessageStartEvent: ({ event }) => {
        const messageId = event.messageId;
        recordRunId(messageId);
        const timestamp = (event as { timestamp?: number }).timestamp;
        if (typeof timestamp !== "number" || !messageId) return;
        setMessageMeta((prev) =>
          prev[messageId]?.createdAt != null
            ? prev
            : { ...prev, [messageId]: { ...prev[messageId], createdAt: timestamp } },
        );
      },
      // A run that ends while groups are still "active" was aborted or errored
      // (a clean finish settles every group via its final snapshot first) — so
      // settle the stragglers instead of letting them spin forever. A finish
      // with outcome "interrupt" is a HITL pause: the run resumes, so active
      // groups there are genuinely still working.
      onRunFinishedEvent: (params) => {
        if ("outcome" in params && params.outcome === "interrupt") return;
        setState(settleActiveGroups);
      },
      onRunErrorEvent: () => setState(settleActiveGroups),
      onRunFailed: () => setState(settleActiveGroups),
    });
    return unsubscribe;
  }, [agent]);

  return (
    <ActivityContext.Provider value={state}>
      <MessageMetaContext.Provider value={messageMeta}>
        <StructuredRenderersContext.Provider value={structuredRenderers ?? {}}>
          {children}
        </StructuredRenderersContext.Provider>
      </MessageMetaContext.Provider>
    </ActivityContext.Provider>
  );
}
