import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import type { ActivityState, StreamGroup } from "../types";

const { fakeAgent } = vi.hoisted(() => {
  type Sub = { onActivitySnapshotEvent?: (p: { event: { content: unknown } }) => void };
  const subscribers: Sub[] = [];
  return {
    fakeAgent: {
      subscribers,
      subscribe(sub: Sub) {
        subscribers.push(sub);
        return {
          unsubscribe: () => {
            const i = subscribers.indexOf(sub);
            if (i >= 0) subscribers.splice(i, 1);
          },
        };
      },
      emit(content: unknown) {
        for (const s of [...subscribers]) s.onActivitySnapshotEvent?.({ event: { content } });
      },
    },
  };
});

vi.mock("@copilotkit/react-core/v2", () => ({
  useAgent: () => ({ agent: fakeAgent }),
}));

import { ActivityContext, KabooActivityProvider } from "./ActivityProvider";

function group(agentName: string, overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: agentName,
    agentName,
    parentGroup: null,
    status: "active",
    tools: [],
    tokens: "",
    timeline: [],
    ...overrides,
  };
}

function Probe() {
  const { groups } = useContext<ActivityState>(ActivityContext);
  return <div data-testid="keys">{Object.keys(groups).sort().join(",")}</div>;
}

beforeEach(() => {
  fakeAgent.subscribers.length = 0;
});

describe("KabooActivityProvider — agent activity snapshots", () => {
  it("exposes the snapshot's groups to consumers", () => {
    render(
      <KabooActivityProvider>
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emit({ groups: { g1: group("researcher"), g2: group("analyst") } });
    });

    expect(screen.getByTestId("keys").textContent).toBe("g1,g2");
  });

  it("replaces state with the latest snapshot", () => {
    render(
      <KabooActivityProvider>
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emit({ groups: { g1: group("researcher") } });
    });
    act(() => {
      fakeAgent.emit({ groups: { g2: group("analyst") } });
    });

    expect(screen.getByTestId("keys").textContent).toBe("g2");
  });

  it("unsubscribes from the agent on unmount", () => {
    const { unmount } = render(
      <KabooActivityProvider>
        <Probe />
      </KabooActivityProvider>,
    );
    expect(fakeAgent.subscribers.length).toBe(1);
    unmount();
    expect(fakeAgent.subscribers.length).toBe(0);
  });
});
