import type { ComponentProps } from "react";
import {
  CopilotChat,
  CopilotChatInput,
  useCopilotChatConfiguration,
  type CopilotChatInputProps,
} from "@copilotkit/react-core/v2";
import { useKabooSend } from "../hooks/useKabooSend";
import { DrillDetailView } from "../components/DrillDetailView";
import { GlassTabs } from "../components/GlassTabs";
import { KabooMessageView } from "./KabooMessageView";

/** Props for {@link KabooChat}: anything `<CopilotChat>` takes. */
export type KabooChatProps = Partial<ComponentProps<typeof CopilotChat>>;

function KabooChatInput(props: CopilotChatInputProps) {
  const config = useCopilotChatConfiguration();
  const send = useKabooSend(config?.agentId);
  return <CopilotChatInput {...props} onSubmitMessage={(value) => void send(value)} />;
}

/**
 * The chat panel: `<CopilotChat>` with kaboo's transcript, plus the drill-down
 * tabs and detail view for sub-agents. Its composer sends through
 * {@link useKabooSend}, so a new message skips any open request. Place it anywhere under
 * `KabooProvider`, which can sit at the route so canvases beside the chat
 * share the agent.
 *
 * @example
 * ```tsx
 * import { KabooProvider } from "@pgege/kaboo-react";
 * import { KabooChat } from "@pgege/kaboo-react/copilotkit";
 *
 * export function Page({ threadId }: { threadId: string }) {
 *   return (
 *     <KabooProvider runtimeUrl="/api/copilotkit" agent="kaboo" threadId={threadId}>
 *       <KabooChat />
 *     </KabooProvider>
 *   );
 * }
 * ```
 */
export function KabooChat(props: KabooChatProps) {
  return (
    <>
      <GlassTabs />
      <CopilotChat
        messageView={KabooMessageView}
        input={KabooChatInput as unknown as KabooChatProps["input"]}
        {...props}
      />
      <DrillDetailView />
    </>
  );
}
