import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import type { ActivityState } from "../types";

const { fakeAgent } = vi.hoisted(() => {
  type Sub = {
    onEvent?: (p: { event: Record<string, unknown> }) => void;
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
      emitEvent(event: Record<string, unknown>) {
        for (const s of [...subscribers]) s.onEvent?.({ event });
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

function Probe() {
  const { groups } = useContext<ActivityState>(ActivityContext);
  return <div data-testid="keys">{Object.keys(groups).sort().join(",")}</div>;
}

beforeEach(() => {
  fakeAgent.subscribers.length = 0;
});

const started = (id: string, name: string, extra: Record<string, unknown> = {}) => ({
  type: "SUBAGENT_STARTED",
  subagentRunId: id,
  name,
  ...extra,
});

describe("KabooActivityProvider — sub-agent events", () => {
  it("opens a group per sub-agent invocation, attached to the call that started it", () => {
    function Calls() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      return (
        <div data-testid="calls">
          {Object.entries(groups)
            .map(([id, g]) => `${id}:${g.agentName}:${g.toolCallId}:${g.parentGroup ?? "-"}`)
            .join(",")}
        </div>
      );
    }
    render(
      <KabooActivityProvider>
        <Calls />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emitEvent(started("o.analyze", "analyze", { parentToolCallId: "c1", metadata: { title: "Analyzing" } }));
      fakeAgent.emitEvent(started("o.analyze.visualizer", "visualizer", { parentToolCallId: "c2", parentSubagentRunId: "o.analyze" }));
    });

    expect(screen.getByTestId("calls").textContent).toBe(
      "o.analyze:analyze:c1:-,o.analyze.visualizer:visualizer:c2:o.analyze",
    );
  });

  it("streams a sub-agent's text and tool calls into its timeline, arguments included", () => {
    function Timeline() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      const g = groups.s1;
      return (
        <div data-testid="timeline">
          {JSON.stringify({
            timeline: g?.timeline,
            tools: g?.tools.map((t) => [t.toolName, t.status, t.toolInput, t.toolResult]),
          })}
        </div>
      );
    }
    render(
      <KabooActivityProvider>
        <Timeline />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emitEvent(started("s1", "analyst"));
      fakeAgent.emitEvent({ type: "TEXT_MESSAGE_START", messageId: "m1", subagentRunId: "s1" });
      fakeAgent.emitEvent({ type: "TEXT_MESSAGE_CONTENT", messageId: "m1", delta: "Look", subagentRunId: "s1" });
      fakeAgent.emitEvent({ type: "TEXT_MESSAGE_CONTENT", messageId: "m1", delta: "ing", subagentRunId: "s1" });
      fakeAgent.emitEvent({ type: "TOOL_CALL_START", toolCallId: "t1", toolCallName: "run_sql", subagentRunId: "s1" });
      fakeAgent.emitEvent({ type: "TOOL_CALL_ARGS", toolCallId: "t1", delta: '{"sql": "SELECT', subagentRunId: "s1" });
    });
    expect(JSON.parse(screen.getByTestId("timeline").textContent ?? "{}")).toEqual({
      timeline: [
        { type: "text", text: "Looking" },
        { type: "tool", toolUseId: "t1" },
      ],
      tools: [["run_sql", "running", { sql: "SELECT" }, null]],
    });

    act(() => {
      fakeAgent.emitEvent({ type: "TOOL_CALL_ARGS", toolCallId: "t1", delta: ' 1"}', subagentRunId: "s1" });
      fakeAgent.emitEvent({ type: "TOOL_CALL_RESULT", toolCallId: "t1", messageId: "r1", content: "1 row", subagentRunId: "s1" });
    });
    expect(JSON.parse(screen.getByTestId("timeline").textContent ?? "{}").tools).toEqual([
      ["run_sql", "success", { sql: "SELECT 1" }, "1 row"],
    ]);
  });

  it("settles a group from SUBAGENT_FINISHED, suspended or done, with its usage", () => {
    function Done() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      return (
        <div data-testid="done">
          {Object.entries(groups)
            .map(([id, g]) => `${id}=${g.status}:${g.usage?.totalTokens ?? 0}`)
            .join(",")}
        </div>
      );
    }
    render(
      <KabooActivityProvider>
        <Done />
      </KabooActivityProvider>,
    );

    act(() => {
      fakeAgent.emitEvent(started("a", "analyst"));
      fakeAgent.emitEvent(started("b", "visualizer"));
      fakeAgent.emitEvent({ type: "SUBAGENT_FINISHED", subagentRunId: "a", outcome: { type: "success" }, metadata: { usage: { totalTokens: 7 } } });
      fakeAgent.emitEvent({ type: "SUBAGENT_FINISHED", subagentRunId: "b", outcome: { type: "suspended" } });
    });
    expect(screen.getByTestId("done").textContent).toBe("a=completed:7,b=interrupted:0");
  });

  it("reopens a suspended invocation when a later run resumes it", () => {
    function Runs() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      return <div data-testid="runs">{`${groups.a?.status}:${groups.a?.runIds?.join("+")}`}</div>;
    }
    render(
      <KabooActivityProvider>
        <Runs />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitEvent({ type: "RUN_STARTED", runId: "r1" });
      fakeAgent.emitEvent(started("a", "analyst"));
      fakeAgent.emitEvent({ type: "SUBAGENT_FINISHED", subagentRunId: "a", outcome: { type: "suspended" } });
      fakeAgent.emitEvent({ type: "RUN_STARTED", runId: "r2" });
      fakeAgent.emitEvent(started("a", "analyst"));
    });
    expect(screen.getByTestId("runs").textContent).toBe("active:r1+r2");
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

describe("KabooActivityProvider — throttled updates", () => {
  it("shows the first event at once and coalesces the rest of the window into one update", () => {
    vi.useFakeTimers();
    try {
      let renders = 0;
      function Counting() {
        renders += 1;
        const { groups } = useContext<ActivityState>(ActivityContext);
        return <div data-testid="keys">{Object.keys(groups).sort().join(",")}</div>;
      }
      render(
        <KabooActivityProvider throttleMs={50}>
          <Counting />
        </KabooActivityProvider>,
      );
      const before = renders;
      act(() => {
        fakeAgent.emitEvent(started("main.a", "a"));
        fakeAgent.emitEvent(started("main.b", "b"));
        fakeAgent.emitEvent(started("main.c", "c"));
      });
      expect(screen.getByTestId("keys").textContent).toBe("main.a");
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(screen.getByTestId("keys").textContent).toBe("main.a,main.b,main.c");
      expect(renders - before).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("KabooActivityProvider — settling groups when a run ends", () => {
  it("marks still-active groups stopped on RUN_ERROR", () => {
    render(
      <KabooActivityProvider>
        <StatusProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitEvent(started("g1", "a"));
      fakeAgent.emitEvent(started("g2", "b"));
      fakeAgent.emitEvent({ type: "SUBAGENT_FINISHED", subagentRunId: "g2" });
    });
    act(() => {
      fakeAgent.emitRunError();
    });
    expect(screen.getByTestId("statuses").textContent).toBe("g1=stopped,g2=completed");
  });

  it("cancels a settled group's tools that were still running, so their rows stop spinning", () => {
    function ToolProbe() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      return <div data-testid="tools">{(groups.g1?.tools ?? []).map((t) => `${t.toolUseId}=${t.status}`).join(",")}</div>;
    }
    render(
      <KabooActivityProvider>
        <ToolProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitEvent(started("g1", "a"));
      fakeAgent.emitEvent({ type: "TOOL_CALL_START", toolCallId: "t1", toolCallName: "run_sql", subagentRunId: "g1" });
      fakeAgent.emitEvent({ type: "TOOL_CALL_START", toolCallId: "t2", toolCallName: "run_sql", subagentRunId: "g1" });
      fakeAgent.emitEvent({ type: "TOOL_CALL_RESULT", toolCallId: "t2", messageId: "x", content: "ok", subagentRunId: "g1" });
    });
    act(() => {
      fakeAgent.emitRunError();
    });
    expect(screen.getByTestId("tools").textContent).toBe("t1=cancelled,t2=success");
  });

  it("records when a cancelled tool stopped, from the event that ended the run", () => {
    function TimingProbe() {
      const { groups } = useContext<ActivityState>(ActivityContext);
      return (
        <div data-testid="timing">
          {(groups.g1?.tools ?? []).map((t) => `${t.toolUseId}=${t.status}:${t.startedAt}-${t.endedAt}`).join(",")}
        </div>
      );
    }
    render(
      <KabooActivityProvider>
        <TimingProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitEvent(started("g1", "a"));
      fakeAgent.emitEvent({ type: "TOOL_CALL_START", toolCallId: "t1", toolCallName: "run_sql", subagentRunId: "g1", timestamp: 1000 });
    });
    act(() => {
      for (const s of [...fakeAgent.subscribers]) s.onRunErrorEvent?.({ event: { type: "RUN_ERROR", timestamp: 4000 } });
    });
    expect(screen.getByTestId("timing").textContent).toBe("t1=cancelled:1000-4000");
  });

  it("marks still-active groups stopped on a successful RUN_FINISHED", () => {
    render(
      <KabooActivityProvider>
        <StatusProbe />
      </KabooActivityProvider>,
    );
    act(() => {
      fakeAgent.emitEvent(started("g1", "a"));
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
      fakeAgent.emitEvent(started("g1", "a"));
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
