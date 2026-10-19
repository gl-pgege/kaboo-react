import type { ReactNode } from "react";
import { CopilotKit, type CopilotKitProps } from "@copilotkit/react-core/v2";
import { KabooActivityProvider, type StructuredRenderers } from "./ActivityProvider";
import { DrillProvider } from "./DrillContext";
import { InterruptBridgeProvider } from "./InterruptBridge";
import { InterruptRenderersProvider } from "./InterruptRenderers";
import { ToolRenderersProvider, type ToolRenderers } from "./ToolRenderers";
import { KabooInterruptHandler, type KabooInterruptHandlerProps } from "../integrations/KabooInterruptHandler";
import { KabooInlineCards } from "../integrations/KabooInlineCards";
import { ReferencesProvider } from "../references/ReferencesProvider";
import type { ReferenceProvider } from "../references/types";
import { KabooSlotsProvider, type KabooSlots } from "./KabooSlots";
import type { ApprovalScope } from "../types";

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
  /**
   * Renderer overrides for the built-in HITL handler, keyed by request kind:
   * `approval`, `form`, or an app's own kind such as `files`.
   */
  interruptRenderers?: KabooInterruptHandlerProps["renderers"];
  /**
   * The approval options the app allows. A request offers only the scopes
   * both the agent and the app allow; `once` is always offered. Defaults to
   * all three (`once`, `thread`, `always`).
   */
  approvalScopes?: ApprovalScope[];
  /**
   * Per-tool-name renderer overrides applied inside every {@link Timeline}
   * surface (agent cards, drill views). Keyed by exact tool name; a match
   * replaces the built-in tool row with the app's custom card.
   */
  toolRenderers?: ToolRenderers;
  /** Skip auto-mounting the built-in {@link KabooInterruptHandler}. */
  disableInterruptHandler?: boolean;
  /**
   * Called with the reason when a person's answer never reached the agent;
   * the requests come back to be answered again. See
   * {@link KabooInterruptHandlerProps.onInterruptError}.
   */
  onInterruptError?: KabooInterruptHandlerProps["onInterruptError"];
  /** Skip auto-mounting the built-in {@link KabooInlineCards}. */
  disableInlineCards?: boolean;
  /**
   * `@` reference providers made available to the composer / `useReferences`.
   * File upload is not implicit — include `uploadProvider()` to offer uploads.
   */
  references?: ReferenceProvider[];
  /**
   * App-supplied render slots for the chat surfaces (end-of-turn footer,
   * per-message footers, run-start indicator). All optional; nothing is
   * rendered in those positions unless provided.
   */
  slots?: KabooSlots;
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
 * import { KabooProvider, GlassTabs, DrillDetailView } from "@pgege/kaboo-react";
 * import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";
 * import "@pgege/kaboo-react/styles.css";
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
  approvalScopes,
  toolRenderers,
  disableInterruptHandler = false,
  onInterruptError,
  disableInlineCards = false,
  references,
  slots,
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
            <InterruptRenderersProvider renderers={interruptRenderers} approvalScopes={approvalScopes}>
              <ToolRenderersProvider renderers={toolRenderers}>
                <ReferencesProvider providers={references} syncObjectStateTo={agent}>
                  <KabooSlotsProvider value={slots ?? {}}>
                    {!disableInterruptHandler && (
                      <KabooInterruptHandler
                        agentId={agent}
                        renderers={interruptRenderers}
                        onInterruptError={onInterruptError}
                      />
                    )}
                    {!disableInlineCards && <KabooInlineCards />}
                    {children}
                  </KabooSlotsProvider>
                </ReferencesProvider>
              </ToolRenderersProvider>
            </InterruptRenderersProvider>
          </InterruptBridgeProvider>
        </DrillProvider>
      </KabooActivityProvider>
    </CopilotKit>
  );
}
