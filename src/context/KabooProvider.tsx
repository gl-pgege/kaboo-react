import type { ReactNode } from "react";
import { CopilotKit, type CopilotKitProps } from "@copilotkit/react-core/v2";
import { KabooActivityProvider, type StructuredRenderers } from "./ActivityProvider";
import { DrillProvider } from "./DrillContext";
import { InterruptBridgeProvider } from "./InterruptBridge";
import { KabooInterruptHandler, type KabooInterruptHandlerProps } from "../integrations/KabooInterruptHandler";
import { KabooInlineCards } from "../integrations/KabooInlineCards";

/** Props for {@link KabooProvider}. */
export interface KabooProviderProps {
  /** URL of the CopilotKit runtime endpoint (e.g. `/api/copilotkit`). */
  runtimeUrl: string;
  /** CopilotKit agent id to run (the workflow entry agent). */
  agent: string;
  /** Conversation id. Scopes both the run and its activity. */
  threadId?: string;
  /** Renderers for structured agent outputs, keyed by output schema name. */
  structuredRenderers?: StructuredRenderers;
  /** Per-interrupt-type renderer overrides for the built-in HITL handler. */
  interruptRenderers?: KabooInterruptHandlerProps["renderers"];
  /** Skip auto-mounting the built-in {@link KabooInterruptHandler}. */
  disableInterruptHandler?: boolean;
  /** Skip auto-mounting the built-in {@link KabooInlineCards}. */
  disableInlineCards?: boolean;
  /** Extra props forwarded to the underlying `<CopilotKit>`. */
  copilotKitProps?: Partial<Omit<CopilotKitProps, "children" | "runtimeUrl" | "agent" | "threadId">>;
  /** Your app subtree, rendered inside all kaboo contexts. */
  children: ReactNode;
}

/**
 * Batteries-included CopilotKit plugin. Renders `<CopilotKit>` and nests every
 * kaboo context (activity -> drill -> interrupt bridge) plus the built-in HITL
 * and inline-card handlers, so integrators drop this once near the root and use
 * only kaboo-react. Activity rides the AG-UI run stream, so there is no separate
 * activity endpoint to configure.
 *
 * @example
 * ```tsx
 * import { CopilotChat } from "@copilotkit/react-core/v2";
 * import { KabooProvider, GlassTabs, DrillDetailView } from "@kaboo/react";
 * import { KabooMessageView } from "@kaboo/react/copilotkit";
 * import "@kaboo/react/styles.css";
 *
 * function App({ agent, threadId }: { agent: string; threadId: string }) {
 *   return (
 *     <KabooProvider runtimeUrl="/api/copilotkit" agent={agent} threadId={threadId}>
 *       <GlassTabs />
 *       <CopilotChat messageView={KabooMessageView} />
 *       <DrillDetailView />
 *     </KabooProvider>
 *   );
 * }
 * ```
 */
export function KabooProvider({
  runtimeUrl,
  agent,
  threadId,
  structuredRenderers,
  interruptRenderers,
  disableInterruptHandler = false,
  disableInlineCards = false,
  copilotKitProps,
  children,
}: KabooProviderProps) {
  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
      agent={agent}
      threadId={threadId}
      useSingleEndpoint={false}
      {...copilotKitProps}
    >
      <KabooActivityProvider agentId={agent} structuredRenderers={structuredRenderers}>
        <DrillProvider>
          <InterruptBridgeProvider>
            {!disableInterruptHandler && (
              <KabooInterruptHandler agentId={agent} renderers={interruptRenderers} />
            )}
            {!disableInlineCards && <KabooInlineCards />}
            {children}
          </InterruptBridgeProvider>
        </DrillProvider>
      </KabooActivityProvider>
    </CopilotKit>
  );
}
