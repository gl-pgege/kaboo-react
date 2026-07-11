// #region quickstart
import { CopilotChat } from "@copilotkit/react-core/v2";
import { KabooProvider, GlassTabs, DrillDetailView } from "@pgege/kaboo-react";
import { KabooMessageView } from "@pgege/kaboo-react/copilotkit";
import "@pgege/kaboo-react/styles.css";

export function App({ agent, threadId }: { agent: string; threadId: string }) {
  return (
    <KabooProvider runtimeUrl="/api/copilotkit" agent={agent} threadId={threadId}>
      <GlassTabs />
      <CopilotChat messageView={KabooMessageView} />
      <DrillDetailView />
    </KabooProvider>
  );
}
// #endregion quickstart
