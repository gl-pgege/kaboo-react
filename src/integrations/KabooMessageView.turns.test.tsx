import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactElement } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import { MessageMetaContext } from "../context/MessageMeta";
import { KabooSlotsProvider, type TurnFooterContext } from "../context/KabooSlots";
import type { MessageMeta, StreamGroup } from "../types";
import type { KabooMessageViewProps } from "./KabooMessageView";

vi.mock("@copilotkit/react-core/v2", () => {
  type ViewMessage = { id: string; role: string; content?: unknown };
  const CopilotChatMessageView = ({
    messages = [],
    assistantMessage: Assistant,
    children,
  }: {
    messages?: ViewMessage[];
    assistantMessage?: ComponentType<{ message: ViewMessage }>;
    children: (props: {
      messages: ViewMessage[];
      isRunning: boolean;
      messageElements: ReactElement[];
      interruptElement: ReactElement | null;
    }) => ReactElement;
  }) =>
    children({
      messages,
      isRunning: false,
      interruptElement: null,
      messageElements: messages.map((m) =>
        m.role === "assistant" && Assistant ? <Assistant key={m.id} message={m} /> : <div key={m.id} />,
      ),
    });
  return {
    CopilotChatMessageView: Object.assign(CopilotChatMessageView, { Cursor: () => null }),
    CopilotChatAssistantMessage: ({ message }: { message: ViewMessage }) => <p>{String(message.content)}</p>,
    CopilotChatUserMessage: () => null,
    useCopilotKit: () => ({ copilotkit: { getRunIdForMessage: () => undefined } }),
    useCopilotChatConfiguration: () => ({ agentId: "kaboo", threadId: "t1" }),
  };
});

vi.mock("../components/AgentCard", () => ({ AgentCard: () => null }));

import { KabooMessageView } from "./KabooMessageView";

type ChatMessage = NonNullable<KabooMessageViewProps["messages"]>[number];

const messages: ChatMessage[] = [
  { id: "u1", role: "user", content: "Change the heading" },
  { id: "a1", role: "assistant", content: "Changing it needs your approval." },
  { id: "a2", role: "assistant", content: "Done." },
];
const meta: Record<string, MessageMeta> = {
  u1: { runId: "run-1" },
  a1: { runId: "run-1" },
  a2: { runId: "run-2" },
};

function assistantGroup(runIds?: string[]): Record<string, StreamGroup> {
  return {
    assistant: {
      title: "Assistant",
      agentName: "assistant",
      parentGroup: null,
      status: "completed",
      tools: [],
      timeline: [],
      inlineChatOwner: true,
      runId: "run-1",
      turnId: "run-1",
      runIds,
    },
  };
}

const footer = ({ messageId, runIds }: TurnFooterContext) => (
  <div data-testid="turn-footer" data-anchor={messageId}>
    {runIds.join(" ")}
  </div>
);

function view(groups: Record<string, StreamGroup>) {
  return (
    <ActivityContext.Provider value={{ groups }}>
      <MessageMetaContext.Provider value={meta}>
        <KabooSlotsProvider value={{ turnFooter: footer }}>
          <KabooMessageView messages={messages} />
        </KabooSlotsProvider>
      </MessageMetaContext.Provider>
    </ActivityContext.Provider>
  );
}

describe("KabooMessageView — a turn resumed in a new run", () => {
  it("ends the turn after the resumed run's reply, with every run of the turn", () => {
    render(view(assistantGroup(["run-1", "run-2"])));

    const footers = screen.getAllByTestId("turn-footer");
    expect(footers).toHaveLength(1);
    expect(footers[0]).toHaveAttribute("data-anchor", "a2");
    expect(footers[0]).toHaveTextContent("run-1 run-2");
  });

  it("gives a single-run turn from an older stream its one run", () => {
    render(view(assistantGroup()));

    expect(screen.getByTestId("turn-footer")).toHaveTextContent("run-1");
  });
});
