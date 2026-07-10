import { describe, it, expect } from "vitest";
import {
  formatToolResult,
  isCancelledResult,
  isControlOnlyStatus,
  normalizeResult,
} from "./output";

describe("formatToolResult", () => {
  it("extracts rows from a `{ rows: [...] }` payload", () => {
    const { rows, text } = formatToolResult(JSON.stringify({ rows: [{ id: "1" }, { id: "2" }] }));
    expect(rows).toEqual([{ id: "1" }, { id: "2" }]);
    expect(text).toBe("");
  });

  it("treats a top-level array of objects as rows", () => {
    const { rows } = formatToolResult(JSON.stringify([{ a: "1" }]));
    expect(rows).toEqual([{ a: "1" }]);
  });

  it("renders a plain object as key/value lines, skipping nullish", () => {
    const { rows, text } = formatToolResult(JSON.stringify({ name: "Acme", count: 3, note: null }));
    expect(rows).toBeNull();
    expect(text).toBe("name: Acme\ncount: 3");
  });

  it("returns raw text when the payload is not JSON", () => {
    expect(formatToolResult("not json")).toEqual({ rows: null, text: "not json" });
  });

  it("does not treat an empty rows array as rows", () => {
    const { rows } = formatToolResult(JSON.stringify({ rows: [] }));
    expect(rows).toBeNull();
  });
});

describe("isCancelledResult", () => {
  it("detects the gated-tool rejection message", () => {
    expect(isCancelledResult("User rejected this action.")).toBe(true);
  });

  it("detects the ask_user decline note", () => {
    expect(isCancelledResult("The user declined to answer.")).toBe(true);
  });

  it("detects a bare cancellation control payload", () => {
    expect(isCancelledResult('{"status":"cancelled"}')).toBe(true);
  });

  it("detects a string-wrapped control payload", () => {
    expect(isCancelledResult('"{\\"status\\":\\"rejected\\"}"')).toBe(true);
  });

  it("is false for real output and empty input", () => {
    expect(isCancelledResult("Here are the search results")).toBe(false);
    expect(isCancelledResult('{"status":"ok","rows":[]}')).toBe(false);
    expect(isCancelledResult(undefined)).toBe(false);
  });
});

describe("isControlOnlyStatus", () => {
  it("is true for a lone HITL control status field (approved or cancelled)", () => {
    expect(isControlOnlyStatus('{"status":"cancelled"}')).toBe(true);
    expect(isControlOnlyStatus('{"status":"declined"}')).toBe(true);
    expect(isControlOnlyStatus('{"status":"approved"}')).toBe(true);
    expect(isControlOnlyStatus('{"status":"accepted"}')).toBe(true);
  });

  it("is false when other fields accompany the status", () => {
    expect(isControlOnlyStatus('{"status":"approved","data":1}')).toBe(false);
  });

  it("is false for a non-control status and for human-readable text", () => {
    expect(isControlOnlyStatus('{"status":"ok"}')).toBe(false);
    expect(isControlOnlyStatus("User rejected this action.")).toBe(false);
  });
});

describe("normalizeResult", () => {
  it("returns null for empty/undefined input", () => {
    expect(normalizeResult(undefined)).toBeNull();
    expect(normalizeResult("")).toBeNull();
  });

  it("unwraps a JSON-quoted string", () => {
    expect(normalizeResult('"hello"')).toBe("hello");
  });

  it("converts escaped newlines to real newlines", () => {
    expect(normalizeResult("line1\\nline2")).toBe("line1\nline2");
  });

  it("passes plain text through unchanged", () => {
    expect(normalizeResult("just text")).toBe("just text");
  });
});
