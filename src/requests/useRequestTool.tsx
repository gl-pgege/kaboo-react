import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactElement } from "react";
import { useAgent, useCopilotChatConfiguration, useCopilotKit, useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { checkArguments, type KabooToolSchema } from "./schema";
import { SKIPPED_ANSWER, currentRequest, requestToolTest, saveAnswer, takeSavedAnswer } from "./openRequests";

/**
 * Where a request stands: waiting for the person, answered but not yet
 * delivered, or answered with the result the agent received.
 */
export type KabooRequestStatus = "waiting" | "sent" | "complete";

/** What a request panel receives. */
export interface KabooRequestRenderProps<T> {
  /** The call's id. */
  toolCallId: string;
  /** The call's arguments, checked against the tool's schema. */
  args: T;
  /** `waiting` for the person, `sent` once answered, `complete` once the agent has the answer. */
  status: KabooRequestStatus;
  /** The answer sent, once there is one. */
  result?: string;
  /** Answer the request. Objects are sent as JSON. */
  answer: (value: unknown) => void;
  /** Decline to answer. */
  skip: () => void;
}

/** Options for {@link useRequestTool}. */
export interface KabooRequestToolOptions<T> {
  /** The tool's name, as agents' `client_tools` allow-lists name it. */
  name: string;
  /** What the agent reads about the tool. */
  description: string;
  /** The arguments schema. Calls that fail it are answered with the problems, so the agent can retry. */
  parameters: KabooToolSchema<T>;
  /** Offer the tool to this agent only. */
  agentId?: string;
  /** The panel: a component, defined outside the one that registers the tool so it keeps its state. */
  render: (props: KabooRequestRenderProps<T>) => ReactElement | null;
}

type Args = Record<string, unknown>;
type HumanInTheLoop = Parameters<typeof useHumanInTheLoop<Args>>[0];
type CallProps = ComponentProps<HumanInTheLoop["render"]>;

const ignore = () => {};

function RequestCall<T extends object>({
  call,
  options,
}: {
  call: CallProps;
  options: KabooRequestToolOptions<T>;
}): ReactElement | null {
  const { toolCallId, args, status, result, respond } = call;
  const config = useCopilotChatConfiguration();
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent(config?.agentId ? { agentId: config.agentId } : undefined);
  const [sent, setSent] = useState<string>();
  const checked = useMemo(
    () => (status === "complete" ? undefined : checkArguments(options.parameters, args)),
    [options.parameters, args, status],
  );

  useEffect(() => {
    if (!respond) return;
    const saved = takeSavedAnswer(toolCallId);
    if (saved !== undefined) void respond(saved);
    else if (checked && "error" in checked) void respond(`Error: invalid arguments. ${checked.error}`);
  }, [respond, toolCallId, checked]);

  const Panel = options.render;
  if (status === "complete") {
    return (
      <Panel
        toolCallId={toolCallId}
        args={args as T}
        status="complete"
        result={typeof result === "string" ? result : JSON.stringify(result)}
        answer={ignore}
        skip={ignore}
      />
    );
  }
  if (!checked || "error" in checked) return null;
  if (sent !== undefined) {
    return <Panel toolCallId={toolCallId} args={checked.value} status="sent" result={sent} answer={ignore} skip={ignore} />;
  }
  if (!respond && agent.isRunning) return null;
  const current = currentRequest(agent.messages, requestToolTest(copilotkit, agent.agentId));
  if (current !== undefined && current !== toolCallId) {
    return <div className="kaboo-request-queued">Up next, once the request above is answered.</div>;
  }

  const answer = (value: unknown) => {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    setSent(text);
    if (respond) void respond(text);
    else saveAnswer(toolCallId, text);
  };
  return (
    <Panel
      toolCallId={toolCallId}
      args={checked.value}
      status="waiting"
      answer={answer}
      skip={() => answer(SKIPPED_ANSWER)}
    />
  );
}

/**
 * Register a browser tool the person answers: a question, a file request, a
 * pick from a list. It is a CopilotKit human-in-the-loop tool, offered to the
 * agents whose `client_tools` allow it, sub-agents included; their requests
 * appear in the main transcript.
 *
 * kaboo-react checks each call's arguments against `parameters` and answers
 * a malformed call with the problems, so the agent can correct it. Requests
 * come up one at a time, in the order the agents asked; the ones waiting their
 * turn show as "Up next". Sending a new message skips the open ones (see
 * {@link useKabooSend}).
 *
 * @example
 * ```tsx
 * import { useRequestTool, toolSchema } from "@pgege/kaboo-react";
 *
 * const parameters = toolSchema<{ reason: string }>(
 *   { type: "object", properties: { reason: { type: "string" } }, required: ["reason"] },
 *   (value) => (typeof (value as { reason?: unknown })?.reason === "string" ? [] : ["reason must be a string"]),
 * );
 *
 * function FileRequests() {
 *   useRequestTool({
 *     name: "request_files",
 *     description: "Ask the person to upload files.",
 *     parameters,
 *     render: ({ args, status, answer, skip }) =>
 *       status === "waiting" ? (
 *         <UploadPanel reason={args.reason} onDone={(ids) => answer({ files: ids })} onSkip={skip} />
 *       ) : null,
 *   });
 *   return null;
 * }
 * ```
 */
export function useRequestTool<T extends object>(options: KabooRequestToolOptions<T>): void {
  const latest = useRef(options);
  latest.current = options;
  const render = useMemo(
    () =>
      function KabooRequest(call: CallProps) {
        return <RequestCall call={call} options={latest.current} />;
      },
    [],
  );
  useHumanInTheLoop<Args>({
    name: options.name,
    description: options.description,
    parameters: options.parameters as unknown as HumanInTheLoop["parameters"],
    ...(options.agentId ? { agentId: options.agentId } : {}),
    render,
  });
}
