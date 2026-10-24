import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AbstractAgent, EventType, type BaseEvent, type RunAgentInput } from "@ag-ui/client";
import { CopilotKitProvider, useCopilotKit } from "@copilotkit/react-core/v2";
import { useEffect } from "react";
import { Observable } from "rxjs";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState, StreamGroup } from "../types";
import { useAgentPresence, useAgentState, useLiveToolCalls } from "./canvas";

function group(overrides: Partial<StreamGroup>): StreamGroup {
  return { title: "g", agentName: "agent", parentGroup: null, status: "active", tools: [], tokens: "", timeline: [], ...overrides };
}

const groups: Record<string, StreamGroup> = {
  "main.visualizer": group({
    title: "Building the dashboard",
    agentName: "visualizer",
    tools: [
      { toolUseId: "c1", toolName: "dashboard___create_dashboard", status: "success", toolResult: "{}" },
      { toolUseId: "c2", toolName: "dashboard___plot_widgets", status: "running", toolInput: { items: [{ title: "Churn" }] } },
    ],
  }),
  "main.analyst": group({ title: "Analyzing", agentName: "analyst", status: "completed" }),
};

function Probe() {
  const presence = useAgentPresence();
  const plotting = useLiveToolCalls(/plot_widgets$/);
  return (
    <>
      <p data-testid="presence">{presence.map((agent) => `${agent.title}:${agent.tool ?? "-"}`).join(",")}</p>
      <p data-testid="plotting">{plotting.map((call) => `${call.agentName}:${JSON.stringify(call.args)}`).join(",")}</p>
    </>
  );
}

describe("canvas hooks over the activity groups", () => {
  it("report who is working and the calls still running, with their streamed arguments", () => {
    const state: ActivityState = { groups };
    render(
      <ActivityContext.Provider value={state}>
        <Probe />
      </ActivityContext.Provider>,
    );
    expect(screen.getByTestId("presence").textContent).toBe("Building the dashboard:dashboard___plot_widgets");
    expect(screen.getByTestId("plotting").textContent).toBe('visualizer:{"items":[{"title":"Churn"}]}');
  });
});

class StateAgent extends AbstractAgent {
  constructor() {
    super({ agentId: "lab", threadId: "t1" });
  }

  run(input: RunAgentInput): Observable<BaseEvent> {
    const events = [
      { type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId },
      { type: EventType.STATE_SNAPSHOT, snapshot: { kaboo_workspace: { focus: { kind: "dashboard", id: "d_1" } } } },
      { type: EventType.STATE_DELTA, delta: [{ op: "replace", path: "/kaboo_workspace/focus/id", value: "d_2" }] },
      { type: EventType.RUN_FINISHED, threadId: input.threadId, runId: input.runId },
    ] as unknown as BaseEvent[];
    return new Observable<BaseEvent>((subscriber) => {
      for (const event of events) subscriber.next(event);
      subscriber.complete();
    });
  }
}

function Focus() {
  const { copilotkit } = useCopilotKit();
  const focus = useAgentState(
    (state) => (state.kaboo_workspace as { focus?: { id: string } } | undefined)?.focus?.id ?? "none",
    "lab",
  );
  useEffect(() => {
    const agent = copilotkit.getAgent("lab");
    if (agent) void copilotkit.runAgent({ agent });
  }, [copilotkit]);
  return <p data-testid="focus">{focus}</p>;
}

describe("useAgentState", () => {
  it("follows the shared state through snapshots and the engine's deltas", async () => {
    render(
      <CopilotKitProvider agents__unsafe_dev_only={{ lab: new StateAgent() }}>
        <Focus />
      </CopilotKitProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("focus").textContent).toBe("d_2"));
  });
});
