import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import { MessageMetaContext } from "../context/MessageMeta";
import { KabooSlotsProvider } from "../context/KabooSlots";
import type { MessageMeta, StreamGroup } from "../types";
import type { KabooMessageViewProps } from "./KabooMessageView";

vi.mock("@copilotkit/react-core/v2", () => {
  type ViewMessage = { id: string; role: string; content?: unknown };
  const CopilotChatMessageView = ({
    messages = [],
    isRunning = false,
    children,
  }: {
    messages?: ViewMessage[];
    isRunning?: boolean;
    children: (props: {
      messages: ViewMessage[];
      isRunning: boolean;
      messageElements: ReactElement[];
      interruptElement: ReactElement | null;
    }) => ReactElement;
  }) =>
    children({
      messages,
      isRunning,
      interruptElement: null,
      messageElements: messages.map((m) => (
        <div key={m.id} data-testid={`${m.role}-message`} data-message-id={m.id}>
          {typeof m.content === "string" ? m.content : null}
        </div>
      )),
    });
  return {
    CopilotChatMessageView: Object.assign(CopilotChatMessageView, {
      Cursor: () => <div data-testid="cursor" />,
    }),
    CopilotChatAssistantMessage: () => null,
    CopilotChatUserMessage: () => null,
    useCopilotKit: () => ({ copilotkit: { getRunIdForMessage: () => undefined } }),
    useCopilotChatConfiguration: () => ({ agentId: "kaboo", threadId: "t1" }),
  };
});

vi.mock("../components/AgentCard", () => ({
  AgentCard: ({ group }: { group: StreamGroup }) => (
    <div data-testid="agent-card">{group.title}</div>
  ),
}));

import { KabooMessageView } from "./KabooMessageView";

type ChatMessage = NonNullable<KabooMessageViewProps["messages"]>[number];

const user = (id: string): ChatMessage => ({ id, role: "user", content: "question" });
const assistant = (id: string, content = "answer"): ChatMessage => ({
  id,
  role: "assistant",
  content,
});
const reasoning = (id: string, content: string, encryptedValue?: string): ChatMessage => ({
  id,
  role: "reasoning",
  content,
  ...(encryptedValue ? { encryptedValue } : {}),
});

function group(overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: "Group",
    agentName: "agent",
    parentGroup: null,
    status: "active",
    tools: [],
    timeline: [],
    ...overrides,
  };
}

const Working = () => <div data-testid="start-indicator">Working on it...</div>;

function view({
  messages,
  isRunning = false,
  groups = {},
  meta = {},
}: {
  messages: ChatMessage[];
  isRunning?: boolean;
  groups?: Record<string, StreamGroup>;
  meta?: Record<string, MessageMeta>;
}) {
  return (
    <ActivityContext.Provider value={{ groups }}>
      <MessageMetaContext.Provider value={meta}>
        <KabooSlotsProvider value={{ runStartIndicator: Working }}>
          <KabooMessageView messages={messages} isRunning={isRunning} />
        </KabooSlotsProvider>
      </MessageMetaContext.Provider>
    </ActivityContext.Provider>
  );
}

describe("KabooMessageView — reasoning messages", () => {
  it("drops reasoning messages with no text, including signature-only ones", () => {
    render(
      view({
        messages: [
          user("u1"),
          reasoning("r1", ""),
          assistant("a1"),
          reasoning("r2", "  \n "),
          assistant("a2"),
          reasoning("r3", "", "c2lnbmF0dXJl"),
          assistant("a3"),
        ],
      }),
    );

    expect(screen.queryAllByTestId("reasoning-message")).toHaveLength(0);
    expect(screen.getAllByTestId("assistant-message")).toHaveLength(3);
  });

  it("merges adjacent reasoning messages into one, keeping the first id", () => {
    render(
      view({
        messages: [
          user("u1"),
          reasoning("r1", "Check the schema."),
          reasoning("r2", ""),
          reasoning("r3", "Then count the rows."),
          assistant("a1"),
        ],
      }),
    );

    const rows = screen.getAllByTestId("reasoning-message");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveAttribute("data-message-id", "r1");
    expect(rows[0].textContent).toBe("Check the schema.\n\nThen count the rows.");
  });

  it("does not merge reasoning separated by another message", () => {
    render(
      view({
        messages: [user("u1"), reasoning("r1", "First."), assistant("a1"), reasoning("r2", "Second.")],
      }),
    );

    expect(screen.getAllByTestId("reasoning-message").map((r) => r.textContent)).toEqual([
      "First.",
      "Second.",
    ]);
  });

  it("keeps a streaming reasoning message that has text", () => {
    render(
      view({
        messages: [user("u1"), reasoning("r1", "Looking at the tables")],
        isRunning: true,
      }),
    );

    expect(screen.getByTestId("reasoning-message")).toHaveTextContent("Looking at the tables");
  });
});

describe("KabooMessageView — run start indicator", () => {
  it("shows while the run is in flight and the current turn has no activity group", () => {
    render(view({ messages: [user("u1")], meta: { u1: { runId: "run-1" } }, isRunning: true }));

    expect(screen.getByTestId("start-indicator")).toBeInTheDocument();
  });

  it("hides once a delegate group of the current run appears, active or finished", () => {
    const base = {
      messages: [user("u1"), assistant("a1", "Asking the analyst")],
      meta: { u1: { runId: "run-1" }, a1: { runId: "run-1" } },
      isRunning: true,
    };
    const delegate = (status: StreamGroup["status"]) => ({
      "main.sql_analyst": group({ toolCallId: "tc-1", runId: "run-1", turnId: "run-1", status }),
    });

    const { rerender } = render(view(base));
    expect(screen.getByTestId("start-indicator")).toBeInTheDocument();

    rerender(view({ ...base, groups: delegate("active") }));
    expect(screen.queryByTestId("start-indicator")).toBeNull();

    rerender(view({ ...base, groups: delegate("completed") }));
    expect(screen.queryByTestId("start-indicator")).toBeNull();
  });

  it("ignores groups from an earlier turn, even one still marked active", () => {
    render(
      view({
        messages: [user("u1"), assistant("a1"), user("u2")],
        meta: { u1: { runId: "run-1" }, a1: { runId: "run-1" }, u2: { runId: "run-2" } },
        groups: {
          "main.sql_analyst": group({
            toolCallId: "tc-1",
            runId: "run-1",
            turnId: "run-1",
            status: "completed",
          }),
          "main.excel_analyst": group({
            toolCallId: "tc-2",
            runId: "run-1",
            turnId: "run-1",
            status: "active",
          }),
        },
        isRunning: true,
      }),
    );

    expect(screen.getByTestId("start-indicator")).toBeInTheDocument();
  });

  it("counts groups of the same turn after an interrupt resume", () => {
    render(
      view({
        messages: [user("u1"), assistant("a1")],
        meta: { u1: { runId: "run-1" }, a1: { runId: "run-1" } },
        groups: {
          "main.sql_analyst": group({
            toolCallId: "tc-2",
            runId: "run-2",
            turnId: "run-1",
          }),
        },
        isRunning: true,
      }),
    );

    expect(screen.queryByTestId("start-indicator")).toBeNull();
  });

  it("does not count a plain agent's inline entry group as activity", () => {
    render(
      view({
        messages: [user("u1")],
        meta: { u1: { runId: "run-1" } },
        groups: {
          assistant: group({ inlineChatOwner: true, runId: "run-1", turnId: "run-1" }),
        },
        isRunning: true,
      }),
    );

    expect(screen.getByTestId("start-indicator")).toBeInTheDocument();
  });

  it("falls back to hiding while any group is active when the current run is unknown", () => {
    const base = { messages: [user("u1")], isRunning: true };

    const { rerender } = render(
      view({ ...base, groups: { "main.sql_analyst": group({ toolCallId: "tc-1" }) } }),
    );
    expect(screen.queryByTestId("start-indicator")).toBeNull();

    rerender(
      view({
        ...base,
        groups: { "main.sql_analyst": group({ toolCallId: "tc-1", status: "completed" }) },
      }),
    );
    expect(screen.getByTestId("start-indicator")).toBeInTheDocument();
  });

  it("renders nothing when no run is in flight", () => {
    render(view({ messages: [user("u1")], meta: { u1: { runId: "run-1" } } }));

    expect(screen.queryByTestId("start-indicator")).toBeNull();
  });
});
