import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { DrillProvider } from "./DrillContext";
import { useDrill } from "../hooks/useDrill";
import type { DrillState } from "../types";

let api: DrillState;
function Probe() {
  api = useDrill();
  return null;
}

function setup() {
  render(
    <DrillProvider>
      <Probe />
    </DrillProvider>,
  );
}

describe("DrillProvider / useDrill", () => {
  it("starts empty at the root", () => {
    setup();
    expect(api.drillPath).toEqual([]);
    expect(api.activeDrill).toBeNull();
  });

  it("drillIn pushes and activeDrill tracks the last entry", () => {
    setup();
    act(() => api.drillIn("a"));
    expect(api.drillPath).toEqual(["a"]);
    expect(api.activeDrill).toBe("a");
    act(() => api.drillIn("b"));
    expect(api.drillPath).toEqual(["a", "b"]);
    expect(api.activeDrill).toBe("b");
  });

  it("drillUp pops one level", () => {
    setup();
    act(() => {
      api.drillIn("a");
      api.drillIn("b");
    });
    act(() => api.drillUp());
    expect(api.drillPath).toEqual(["a"]);
    expect(api.activeDrill).toBe("a");
  });

  it("drillToRoot empties the path", () => {
    setup();
    act(() => {
      api.drillIn("a");
      api.drillIn("b");
    });
    act(() => api.drillToRoot());
    expect(api.drillPath).toEqual([]);
    expect(api.activeDrill).toBeNull();
  });

  it("drillToLevel(n) slices to n+1 entries", () => {
    setup();
    act(() => {
      api.drillIn("a");
      api.drillIn("b");
      api.drillIn("c");
    });
    act(() => api.drillToLevel(1));
    expect(api.drillPath).toEqual(["a", "b"]);
    expect(api.activeDrill).toBe("b");
  });
});
