import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ActivityContext } from "../context/ActivityProvider";
import type { ActivityState, StreamGroup } from "../types";
import type { GroupEntry } from "../utils/groups";
import { TurnFeedback } from "./TurnFeedback";
import { resolveTurnIds } from "./useTurnFeedback";

function group(overrides: Partial<StreamGroup> = {}): StreamGroup {
  return {
    title: "Group",
    agentName: "agent",
    parentGroup: null,
    status: "completed",
    tools: [],
    tokens: "",
    timeline: [],
    ...overrides,
  };
}

function withActivity(state: Partial<ActivityState>, node: ReactNode) {
  const full: ActivityState = { groups: {}, ...state };
  return <ActivityContext.Provider value={full}>{node}</ActivityContext.Provider>;
}

describe("resolveTurnIds", () => {
  it("prefers the run-level trace over a group's own trace", () => {
    const entries: GroupEntry[] = [
      ["g1", group({ runId: "r1", turnId: "t1", traceId: "b".repeat(32) })],
    ];
    const ids = resolveTurnIds(entries, { r1: "a".repeat(32) });
    expect(ids).toEqual({ traceId: "a".repeat(32), runId: "r1", turnId: "t1" });
  });

  it("falls back to a group trace when there is no run-level entry", () => {
    const entries: GroupEntry[] = [["g1", group({ runId: "r1", traceId: "b".repeat(32) })]];
    expect(resolveTurnIds(entries, {}).traceId).toBe("b".repeat(32));
  });

  it("returns undefined ids for untraced streams", () => {
    const entries: GroupEntry[] = [["g1", group()]];
    expect(resolveTurnIds(entries)).toEqual({
      traceId: undefined,
      runId: undefined,
      turnId: undefined,
    });
  });
});

describe("TurnFeedback", () => {
  const entries: GroupEntry[] = [["g1", group({ runId: "r1", turnId: "t1" })]];

  it("submits a positive score with the turn's correlation ids", async () => {
    const onFeedback = vi.fn().mockResolvedValue(undefined);
    render(
      withActivity(
        { traceByRun: { r1: "a".repeat(32) } },
        <TurnFeedback groups={entries} onFeedback={onFeedback} />,
      ),
    );

    fireEvent.click(screen.getByLabelText("Helpful"));

    await waitFor(() => expect(onFeedback).toHaveBeenCalledOnce());
    expect(onFeedback).toHaveBeenCalledWith({
      value: 1,
      comment: undefined,
      traceId: "a".repeat(32),
      runId: "r1",
      turnId: "t1",
    });
    expect(screen.getByText(/thanks for the feedback/i)).toBeTruthy();
  });

  it("collects an optional comment on thumbs down", async () => {
    const onFeedback = vi.fn().mockResolvedValue(undefined);
    render(withActivity({}, <TurnFeedback groups={entries} onFeedback={onFeedback} />));

    fireEvent.click(screen.getByLabelText("Not helpful"));
    fireEvent.change(screen.getByPlaceholderText(/what went wrong/i), {
      target: { value: "wrong table" },
    });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => expect(onFeedback).toHaveBeenCalledOnce());
    expect(onFeedback.mock.calls[0][0]).toMatchObject({ value: 0, comment: "wrong table" });
  });

  it("renders nothing with requireTrace when the turn has no trace", () => {
    const { container } = render(
      withActivity({}, <TurnFeedback groups={entries} onFeedback={vi.fn()} requireTrace />),
    );
    expect(container.innerHTML).toBe("");
  });

  it("still renders without a trace when requireTrace is off", () => {
    render(withActivity({}, <TurnFeedback groups={entries} onFeedback={vi.fn()} />));
    expect(screen.getByText(/was this helpful/i)).toBeTruthy();
  });
});
