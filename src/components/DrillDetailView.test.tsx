import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import { DrillContext } from "../context/DrillContext";
import {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
} from "../context/InterruptBridge";
import { InterruptRenderersProvider } from "../context/InterruptRenderers";
import type {
  ActivityState,
  DrillState,
  InterruptRendererProps,
  StreamGroup,
} from "../types";
import type { ActiveInterrupt } from "../context/InterruptBridge";
import { DrillDetailView } from "./DrillDetailView";

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

const NOOP = () => {};

function harness(
  groups: Record<string, StreamGroup>,
  activeDrill: string,
  interrupts: ActiveInterrupt[],
  node: ReactNode,
) {
  const activity: ActivityState = { groups };
  const drill: DrillState = {
    drillPath: [activeDrill],
    activeDrill,
    drillIn: NOOP,
    drillUp: NOOP,
    drillToRoot: NOOP,
    drillToLevel: NOOP,
  };
  return (
    <ActivityContext.Provider value={activity}>
      <DrillContext.Provider value={drill}>
        <InterruptBridgeProvider>
          <InterruptBridgePublisher interrupts={interrupts} />
          {node}
        </InterruptBridgeProvider>
      </DrillContext.Provider>
    </ActivityContext.Provider>
  );
}

describe("DrillDetailView token usage breakdown", () => {
  it("shows the in/out/total breakdown when the group has usage", () => {
    const g = group({
      status: "completed",
      usage: { inputTokens: 48_200, outputTokens: 3_100, totalTokens: 51_300 },
    });
    render(harness({ main: g }, "main", [], <DrillDetailView />));

    expect(screen.getByText("48.2k")).toBeInTheDocument();
    expect(screen.getByText("3.1k")).toBeInTheDocument();
    expect(screen.getByText("51.3k")).toBeInTheDocument();
    expect(screen.getByText("total tokens")).toBeInTheDocument();
  });

  it("renders no breakdown without usage", () => {
    const g = group({ status: "completed" });
    render(harness({ main: g }, "main", [], <DrillDetailView />));
    expect(screen.queryByText("total tokens")).toBeNull();
  });
});

describe("DrillDetailView interrupt rendering", () => {
  const formInterrupt: ActiveInterrupt = {
    id: "i1",
    reason: {
      type: "form",
      questions: [{ question: "Retry?", type: "radio", options: ["Yes", "No"] }],
    },
    toolCallId: "t-unanchored",
    onResolve: NOOP,
    onCancel: NOOP,
  };

  it("uses the registered renderer for unanchored interrupts", () => {
    const Custom = ({ reason }: InterruptRendererProps) => (
      <div data-testid="custom-form">{reason.type}</div>
    );
    const g = group({ status: "interrupted" });
    render(
      harness(
        { main: g },
        "main",
        [formInterrupt],
        <InterruptRenderersProvider renderers={{ form: Custom }}>
          <DrillDetailView />
        </InterruptRenderersProvider>,
      ),
    );
    expect(screen.getByTestId("custom-form")).toHaveTextContent("form");
  });

  it("falls back to the built-in renderer when none is registered", () => {
    const g = group({ status: "interrupted" });
    render(
      harness(
        { main: g },
        "main",
        [formInterrupt],
        <InterruptRenderersProvider renderers={{}}>
          <DrillDetailView />
        </InterruptRenderersProvider>,
      ),
    );
    expect(screen.getByText("Retry?")).toBeInTheDocument();
  });
});
