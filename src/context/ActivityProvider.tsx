import { useState, useEffect, useRef, createContext, type ReactNode, type ReactElement } from "react";
import type { ActivityState } from "../types";

const EMPTY: ActivityState = { groups: {} };

export type StructuredRenderers = Record<string, (data: Record<string, unknown>) => ReactElement>;

export const ActivityContext = createContext<ActivityState>(EMPTY);
export const StructuredRenderersContext = createContext<StructuredRenderers>({});

export interface KabooActivityProviderProps {
  url: string;
  entryAgent?: string;
  /**
   * Conversation id to scope the activity stream to. When provided it is sent
   * as a `threadId` query param so the server only streams this conversation's
   * activity. Omit for the merged (single-tenant) view.
   */
  threadId?: string;
  structuredRenderers?: StructuredRenderers;
  children: ReactNode;
}

export function KabooActivityProvider({ url, entryAgent, threadId, structuredRenderers, children }: KabooActivityProviderProps) {
  const [state, setState] = useState<ActivityState>(EMPTY);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const streamUrl = threadId
      ? `${url}${url.includes("?") ? "&" : "?"}threadId=${encodeURIComponent(threadId)}`
      : url;
    const es = new EventSource(streamUrl);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as ActivityState;
        if (entryAgent) {
          const filtered: ActivityState = { groups: {} };
          for (const [key, group] of Object.entries(data.groups)) {
            if (group.agentName !== entryAgent) {
              filtered.groups[key] = group;
            }
          }
          setState(filtered);
        } else {
          setState(data);
        }
      } catch { /* ignore malformed data */ }
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [url, entryAgent, threadId]);

  return (
    <ActivityContext.Provider value={state}>
      <StructuredRenderersContext.Provider value={structuredRenderers ?? {}}>
        {children}
      </StructuredRenderersContext.Provider>
    </ActivityContext.Provider>
  );
}
