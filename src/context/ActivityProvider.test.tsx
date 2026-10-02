import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import type { ActivityState, StreamGroup } from "../types";

const { fakeAgent } = vi.hoisted(() => {
  type Sub = {
    onActivitySnapshotEvent?: (p: { event: { content: unknown } }) => void;
    onActivityDeltaEvent?: (p: { event: { patch: unknown } }) => void;
    onCustomEvent?: (p: { event: { name: string; value: unknown } }) => void;
    onRunStartedEvent?: (p: { event: { runId?: string } }) => void;
    onTextMessageStartEvent?: (p: { event: { messageId?: string; timestamp?: number } }) => void;
    onToolCallStartEvent?: (p: { event: { toolCallId: string; parentMessageId?: string } }) => void;
    onRunFinishedEvent?: (p: { outcome?: string }) => void;
    onRunErrorEvent?: (p: { event: unknown }) => void;
    onRunFailed?: (p: { error: Error }) => void;
  };
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
      emitDelta(patch: unknown) {
        for (const s of [...subscribers]) s.onActivityDeltaEvent?.({ event: { patch } });
      },
      emitCustom(name: string, value: unknown) {
        for (const s of [...subscribers]) s.onCustomEvent?.({ event: { name, value } });
      },
      emitTextStart(messageId: string, timestamp?: number) {
        for (const s of [...subscribers]) s.onTextMessageStartEvent?.({ event: { messageId, timestamp } });
      },
      emitRunStarted(runId: string) {
        for (const s of [...subscribers]) s.onRunStartedEvent?.({ event: { runId } });
      },
      emitToolCallStart(toolCallId: string, parentMessageId?: string) {
        for (const s of [...subscribers]) s.onToolCallStartEvent?.({ event: { toolCallId, parentMessageId } });
      },
      emitRunFinished(outcome?: string) {
        for (const s of [...subscribers]) s.onRunFinishedEvent?.(outcome ? { outcome } : {});
      },
      emitRunError() {
        for (const s of [...subscribers]) s.onRunErrorEvent?.({ event: {} });
      },
    },
  };
});

vi.mock("@copilotkit/react-core/v2", () => ({
  useAgent: () => ({ agent: fakeAgent }),
}));

import { ActivityContext, KabooActivityProvider } from "./ActivityProvider";
import { useMessageMeta, MESSAGE_META_EVENT } from "./MessageMeta";

function group(agentName: string, overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: agentName,
    agentName,
    parentGroup: null,
    status: "active",
    tools: [],
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

  it("patches the tree from an activity delta", () => {
    render(
      <KabooActivityProvider>
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emit({ groups: { g1: group("researcher") } });
    });
    act(() => {
      fakeAgent.emitDelta([{ op: "add", path: "/groups/g2", value: group("analyst") }]);
    });

    expect(screen.getByTestId("keys").textContent).toBe("g1,g2");
  });

  it("applies a patch to a nested value without disturbing the rest", () => {
    function TextProbe() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      const entry = groups.g1?.timeline?.[0];
      return <div data-testid="text">{entry && "text" in entry ? entry.text : ""}</div>;
    }
    render(
      <KabooActivityProvider>
        <TextProbe />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emit({
        groups: { g1: group("researcher", { timeline: [{ type: "text", text: "one" }] }) },
      });
    });
    act(() => {
      fakeAgent.emitDelta([{ op: "replace", path: "/groups/g1/timeline/0/text", value: "one two" }]);
    });

    expect(screen.getByTestId("text").textContent).toBe("one two");
  });

  it("keeps the last good tree when a patch cannot be applied", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <KabooActivityProvider>
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emit({ groups: { g1: group("researcher") } });
    });
    act(() => {
      // Patching into a group that does not exist.
      fakeAgent.emitDelta([{ op: "replace", path: "/groups/nope/status", value: "error" }]);
    });

    expect(screen.getByTestId("keys").textContent).toBe("g1");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("ignores an empty patch", () => {
    render(
      <KabooActivityProvider>
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emit({ groups: { g1: group("researcher") } });
    });
    act(() => {
      fakeAgent.emitDelta([]);
    });

    expect(screen.getByTestId("keys").textContent).toBe("g1");
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

function StatusProbe() {
  const { groups } = useContext<ActivityState>(ActivityContext);
  return (
    <div data-testid="statuses">
      {Object.entries(groups)
        .map(([id, g]) => `${id}=${g.status}`)
        .sort()
        .join(",")}
    </div>
  );
}

describe("KabooActivityProvider — settling groups when a run ends", () => {
  it("marks still-active groups stopped on RUN_ERROR", () => {
    render(
      <KabooActivityProvider>
        <StatusProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emit({ groups: { g1: group("a"), g2: group("b", { status: "completed" }) } });
    });
    act(() => {
      fakeAgent.emitRunError();
    });
    expect(screen.getByTestId("statuses").textContent).toBe("g1=stopped,g2=completed");
  });

  it("marks still-active groups stopped on a successful RUN_FINISHED", () => {
    render(
      <KabooActivityProvider>
        <StatusProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emit({ groups: { g1: group("a") } });
    });
    act(() => {
      fakeAgent.emitRunFinished("success");
    });
    expect(screen.getByTestId("statuses").textContent).toBe("g1=stopped");
  });

  it("leaves active groups alone when the run pauses for an interrupt", () => {
    render(
      <KabooActivityProvider>
        <StatusProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emit({ groups: { g1: group("a") } });
    });
    act(() => {
      fakeAgent.emitRunFinished("interrupt");
    });
    expect(screen.getByTestId("statuses").textContent).toBe("g1=active");
  });
});

function MetaProbe() {
  const meta = useMessageMeta();
  return (
    <div data-testid="meta">
      {Object.entries(meta)
        .map(
          ([id, m]) =>
            `${id}:${m.createdAt ?? "-"}:${Array.isArray(m.references) ? m.references.length : 0}`,
        )
        .sort()
        .join(",")}
    </div>
  );
}

describe("KabooActivityProvider — message metadata from the event stream", () => {
  it("records createdAt and references from kaboo.message_meta events", () => {
    render(
      <KabooActivityProvider>
        <MetaProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitCustom(MESSAGE_META_EVENT, {
        messageId: "u1",
        role: "user",
        createdAt: 1000,
        references: [{ name: "assets-db" }],
      });
    });
    expect(screen.getByTestId("meta").textContent).toBe("u1:1000:1");
  });

  it("records assistant message times from TEXT_MESSAGE_START timestamps without clobbering meta", () => {
    render(
      <KabooActivityProvider>
        <MetaProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitTextStart("a1", 2000);
    });
    act(() => {
      fakeAgent.emitTextStart("a1", 3000); // later start must not overwrite
    });
    act(() => {
      fakeAgent.emitTextStart("a2"); // no timestamp -> ignored
    });
    expect(screen.getByTestId("meta").textContent).toBe("a1:2000:0");
  });

  it("attributes messages to the enclosing run, across multiple replayed runs", () => {
    function RunProbe() {
      const meta = useMessageMeta();
      return (
        <div data-testid="runs">
          {Object.entries(meta)
            .map(([id, m]) => `${id}=${m.runId ?? "-"}`)
            .sort()
            .join(",")}
        </div>
      );
    }
    render(
      <KabooActivityProvider>
        <RunProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitRunStarted("run-1");
      fakeAgent.emitToolCallStart("tc1", "a1");
      fakeAgent.emitTextStart("a2", 100);
      fakeAgent.emitRunStarted("run-2");
      fakeAgent.emitTextStart("a3", 200);
    });
    expect(screen.getByTestId("runs").textContent).toBe("a1=run-1,a2=run-1,a3=run-2");
  });

  it("attributes a user message to the run its kaboo.message_meta arrived in", () => {
    function UserRunProbe() {
      const meta = useMessageMeta();
      return (
        <div data-testid="user-runs">
          {Object.entries(meta)
            .map(([id, m]) => `${id}=${m.runId ?? "-"}:${m.createdAt ?? "-"}`)
            .sort()
            .join(",")}
        </div>
      );
    }
    render(
      <KabooActivityProvider>
        <UserRunProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitRunStarted("run-1");
      fakeAgent.emitCustom(MESSAGE_META_EVENT, { messageId: "u1", role: "user", createdAt: 1000 });
      fakeAgent.emitRunStarted("run-2");
      fakeAgent.emitCustom(MESSAGE_META_EVENT, { messageId: "u2", role: "user", createdAt: 2000 });
    });
    expect(screen.getByTestId("user-runs").textContent).toBe("u1=run-1:1000,u2=run-2:2000");
  });

  it("records no runId before any run has started", () => {
    function RunProbe() {
      const meta = useMessageMeta();
      return <div data-testid="runs2">{Object.keys(meta).join(",")}</div>;
    }
    render(
      <KabooActivityProvider>
        <RunProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitToolCallStart("tc1", "a1");
    });
    expect(screen.getByTestId("runs2").textContent).toBe("");
  });

  it("ignores custom events with other names", () => {
    render(
      <KabooActivityProvider>
        <MetaProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitCustom("something.else", { messageId: "u1", createdAt: 1 });
    });
    expect(screen.getByTestId("meta").textContent).toBe("");
  });
});
