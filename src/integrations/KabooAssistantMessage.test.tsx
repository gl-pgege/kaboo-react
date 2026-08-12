import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { TurnBindingProvider } from "../context/TurnBinding";
import { KabooSlotsProvider } from "../context/KabooSlots";
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
  turnGroupsByMessageId: Map<string, GroupEntry[]> = new Map(),
) {
  return (
    <TurnBindingProvider value={{ rootsByMessageId, turnGroupsByMessageId }}>
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

  it("renders the turnFooter slot with the turn's groups on the anchor message only", () => {
    const turnGroups: GroupEntry[] = [
      ["team.viz", group({ title: "Visualizer", outputSchemaName: "DashboardSnippet" })],
    ];
    const slots = {
      turnFooter: ({ messageId, groups }: { messageId: string; groups: GroupEntry[] }) => (
        <div data-testid="turn-footer">
          {messageId}:{groups.map(([, g]) => g.title).join(",")}
        </div>
      ),
    };

    const { rerender } = render(
      <KabooSlotsProvider value={slots}>
        {withBinding(new Map(), <KabooAssistantMessage message={msg("m1")} />, new Map([["m1", turnGroups]]))}
      </KabooSlotsProvider>,
    );
    expect(screen.getByTestId("turn-footer")).toHaveTextContent("m1:Visualizer");

    // A message that isn't the turn's anchor renders no footer.
    rerender(
      <KabooSlotsProvider value={slots}>
        {withBinding(new Map(), <KabooAssistantMessage message={msg("m0")} />, new Map([["m1", turnGroups]]))}
      </KabooSlotsProvider>,
    );
    expect(screen.queryByTestId("turn-footer")).toBeNull();
  });

  it("renders no turn footer at all when the slot is not provided", () => {
    const turnGroups: GroupEntry[] = [["g", group()]];
    render(withBinding(new Map(), <KabooAssistantMessage message={msg("m1")} />, new Map([["m1", turnGroups]])));
    expect(document.querySelector(".kaboo-turn-footer")).toBeNull();
  });

  it("renders the assistantMessageFooter slot under the reply", () => {
    render(
      <KabooSlotsProvider
        value={{ assistantMessageFooter: (m) => <div data-testid="msg-footer">at:{String(m.id)}</div> }}
      >
        {withBinding(new Map(), <KabooAssistantMessage message={msg("m1")} />)}
      </KabooSlotsProvider>,
    );
    expect(screen.getByTestId("msg-footer")).toHaveTextContent("at:m1");
  });
});
