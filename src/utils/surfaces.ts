import type { StreamGroup } from "../types";

export const SURFACE_TOOLS = new Set(["render_a2ui"]);

export function surfaceOwner(groups: Record<string, StreamGroup>, messageId: string): StreamGroup | undefined {
  const callId = messageId.replace(/^a2ui-surface-/, "");
  return Object.values(groups).find(
    (group) =>
      group.toolCallId &&
      !group.inlineChatOwner &&
      (group.toolCallId === callId || group.tools.some((tool) => tool.toolUseId === callId)),
  );
}
