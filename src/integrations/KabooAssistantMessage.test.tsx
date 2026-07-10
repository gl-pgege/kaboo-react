import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { TurnBindingProvider } from "../context/TurnBinding";
import type { GroupEntry } from "../utils/groups";
import type { StreamGroup } from "../types";

vi.mock("@copilotkit/react-core/v2", () => ({
  CopilotChatAssistantMessage: ({ message }: { message: { id?: string } }) => (
    <div data-testid="default-assistant">assistant:{message?.id}</div>
  ),
}));

vi.mock("../components/AgentCard", () => ({
  AgentCard: ({ group }: { group: StreamGroup }) => (
    <div data-testid="agent-card">{group.title}</div>
  ),
}));

import { KabooAssistantMessage } from "./KabooAssistantMessage";

function group(overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: "Group",
    agentName: "agent",
    parentGroup: null,
    status: "active",
    tools: [],
    tokens: "",
    timeline: [],
    ...overrides,
  };
}

function withBinding(
  rootsByMessageId: Map<string, GroupEntry[]>,
  node: ReactNode,
) {
  return (
    <TurnBindingProvider value={{ rootsByMessageId }}>
      {node}
    </TurnBindingProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const msg = (id: string) => ({ id, role: "assistant" }) as any;

describe("KabooAssistantMessage", () => {
  it("renders this message's turn cards above the reply", () => {
    const roots: GroupEntry[] = [
      ["team.planner", group({ title: "Planning" })],
      ["team.writer", group({ title: "Writing" })],
    ];

    render(withBinding(new Map([["m1", roots]]), <KabooAssistantMessage message={msg("m1")} />));

    expect(screen.getByText("Planning")).toBeInTheDocument();
    expect(screen.getByText("Writing")).toBeInTheDocument();
    expect(screen.getByTestId("default-assistant")).toHaveTextContent("assistant:m1");
  });

  it("renders no cards on a message bound to a different turn (no cross-turn bleed)", () => {
    const roots: GroupEntry[] = [["team.writer", group({ title: "Writing" })]];

    render(withBinding(new Map([["m2", roots]]), <KabooAssistantMessage message={msg("m1")} />));

    expect(screen.queryByTestId("agent-card")).toBeNull();
    expect(screen.getByTestId("default-assistant")).toHaveTextContent("assistant:m1");
  });

  it("renders just the default message when the turn has no member cards", () => {
    render(withBinding(new Map(), <KabooAssistantMessage message={msg("m1")} />));

    expect(screen.queryByTestId("agent-card")).toBeNull();
    expect(screen.getByTestId("default-assistant")).toBeInTheDocument();
  });
});
