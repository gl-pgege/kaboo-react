import { useRenderTool } from "@copilotkit/react-core/v2";
import { AskUserRow } from "../components/AskUserRow";

/**
 * Permissive Standard Schema. `useRenderTool` requires a `parameters` schema but
 * never validates against it at render time (it parses the raw tool args). This
 * shim satisfies the type without pulling in a schema library.
 */
const ANY_PARAMETERS = {
  "~standard": {
    version: 1 as const,
    vendor: "kaboo",
    validate: (value: unknown) => ({ value }),
  },
};

/**
 * Renders `ask_user` prompts inline in the chat, anchored to the tool call: the
 * live multiple-choice form while the question waits, then the question and the
 * person's answer once it resolves. The tool call is a permanent part of the
 * transcript, so the Q&A persists in chronological order and survives a
 * reload/replay.
 *
 * The chat-level interrupt slot defers to this anchor whenever the pending tool
 * is in the activity groups, so for an agent whose tools render in the chat
 * (no agent card of its own) this is the only surface for the live form.
 */
export function KabooAskUser({ agentId }: { agentId?: string }) {
  useRenderTool({
    name: "ask_user",
    ...(agentId ? { agentId } : {}),
    parameters: ANY_PARAMETERS,
    render: ({ toolCallId, parameters, status, result }) => (
      <AskUserRow
        tool={{
          toolUseId: toolCallId,
          toolName: "ask_user",
          toolInput: parameters,
          toolResult: typeof result === "string" ? result : undefined,
          status: status === "complete" ? "success" : "running",
        }}
      />
    ),
  });

  return null;
}
