import { useCallback } from "react";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { skipOpenRequests } from "../requests/openRequests";

/** What a user message holds: text, or text with attachment parts. */
export type KabooUserContent = Extract<
  Parameters<ReturnType<typeof useAgent>["agent"]["addMessage"]>[0],
  {
    /** A user message. */
    role: "user";
  }
>["content"];

/** What {@link useKabooSend}'s `send` accepts besides the content. */
export interface KabooSendOptions {
  /** The new message's id, when the caller needs to know it beforehand. */
  id?: string;
  /** Sent with this run only, on top of the provider's `properties` — such as a canvas's `kaboo_action`. */
  forwardedProps?: Record<string, unknown>;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/**
 * Send a user message and run the agent through CopilotKit, the way
 * `<CopilotChat>` does: the run carries the app's frontend tools, context and
 * `properties`, and CopilotKit answers the tools it calls. Use it for every
 * way a message enters the conversation (the composer, a suggestion, an "Ask"
 * button) so they all behave alike.
 *
 * A message sent while requests wait for the person skips them: each open
 * request gets the answer the person already gave it or a note that they
 * moved on, the agent takes those in, and then the message runs.
 *
 * @param agentId - The agent to run; the provider's agent when omitted.
 * @returns `send(content, options?)`, resolving with the message id once the run (and any follow-up) ends.
 *
 * @example
 * ```tsx
 * import { useKabooSend } from "@pgege/kaboo-react";
 *
 * function AskButton({ question }: { question: string }) {
 *   const send = useKabooSend();
 *   return <button onClick={() => void send(question)}>{question}</button>;
 * }
 * ```
 */
export function useKabooSend(agentId?: string) {
  const { copilotkit } = useCopilotKit();
  const { agent: rendered } = useAgent({ ...(agentId ? { agentId } : {}), updates: [] });
  return useCallback(
    async (content: KabooUserContent, options: KabooSendOptions = {}) => {
      const id = options.id ?? newId();
      // The registry's instance, which the chat renders: the one captured at
      // render can be replaced while the page is still connecting.
      const agent = (rendered.agentId && copilotkit.getAgent(rendered.agentId)) || rendered;
      await skipOpenRequests(copilotkit, agent);
      agent.addMessage({ id, role: "user", content });
      await copilotkit.runAgent({ agent, ...(options.forwardedProps ? { forwardedProps: options.forwardedProps } : {}) });
      return id;
    },
    [rendered, copilotkit],
  );
}
