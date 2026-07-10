import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useContext } from "react";
import { ActivityContext, KabooActivityProvider } from "./ActivityProvider";
import type { ActivityState, StreamGroup } from "../types";

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  url: string;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  closed = false;

  constructor(url: string) {
    this.url = url;
    FakeEventSource.instances.push(this);
  }

  emit(data: unknown): void {
    this.onmessage?.({ data: JSON.stringify(data) });
  }

  close(): void {
    this.closed = true;
  }
}

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
  FakeEventSource.instances = [];
  vi.stubGlobal("EventSource", FakeEventSource as unknown as typeof EventSource);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("KabooActivityProvider — SSE ingestion", () => {
  it("exposes the streamed groups to consumers", () => {
    render(
      <KabooActivityProvider url="/activity-stream">
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      FakeEventSource.instances[0].emit({
        groups: { g1: group("researcher"), g2: group("analyst") },
      });
    });

    expect(screen.getByTestId("keys").textContent).toBe("g1,g2");
  });

  it("filters out the entry agent's group when entryAgent is set", () => {
    render(
      <KabooActivityProvider url="/activity-stream" entryAgent="coordinator">
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      FakeEventSource.instances[0].emit({
        groups: { entry: group("coordinator"), sub: group("researcher") },
      });
    });

    expect(screen.getByTestId("keys").textContent).toBe("sub");
  });

  it("ignores malformed SSE payloads without throwing", () => {
    render(
      <KabooActivityProvider url="/activity-stream">
        <Probe />
      </KabooActivityProvider>,
    );

    act(() => {
      FakeEventSource.instances[0].onmessage?.({ data: "not json{" });
    });

    expect(screen.getByTestId("keys").textContent).toBe("");
  });
});

describe("KabooActivityProvider — stream URL", () => {
  it("appends threadId as a query param, url-encoded", () => {
    render(
      <KabooActivityProvider url="/activity-stream" threadId="abc 123">
        <Probe />
      </KabooActivityProvider>,
    );

    expect(FakeEventSource.instances[0].url).toBe("/activity-stream?threadId=abc%20123");
  });

  it("uses & when the base url already has a query string", () => {
    render(
      <KabooActivityProvider url="/activity-stream?x=1" threadId="t">
        <Probe />
      </KabooActivityProvider>,
    );

    expect(FakeEventSource.instances[0].url).toBe("/activity-stream?x=1&threadId=t");
  });

  it("uses the bare url when no threadId is given", () => {
    render(
      <KabooActivityProvider url="/activity-stream">
        <Probe />
      </KabooActivityProvider>,
    );

    expect(FakeEventSource.instances[0].url).toBe("/activity-stream");
  });

  it("closes the EventSource on unmount", () => {
    const { unmount } = render(
      <KabooActivityProvider url="/activity-stream">
        <Probe />
      </KabooActivityProvider>,
    );
    const es = FakeEventSource.instances[0];
    unmount();
    expect(es.closed).toBe(true);
  });
});
