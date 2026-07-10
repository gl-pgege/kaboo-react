import { describe, it, expect } from "vitest";
import { formatToolInput } from "./input";

describe("formatToolInput", () => {
  it("returns empty summary for null/undefined", () => {
    expect(formatToolInput(null)).toEqual({ summary: "", detail: null });
    expect(formatToolInput(undefined)).toEqual({ summary: "", detail: null });
  });

  it("passes a string through as the summary", () => {
    expect(formatToolInput("SELECT 1")).toEqual({ summary: "SELECT 1", detail: null });
  });

  it("prefers a trimmed `query` field", () => {
    expect(formatToolInput({ query: "  SELECT * FROM t  ", limit: 5 })).toEqual({
      summary: "SELECT * FROM t",
      detail: null,
    });
  });

  it("falls back to `table_name` then `url`", () => {
    expect(formatToolInput({ table_name: "companies" }).summary).toBe("companies");
    expect(formatToolInput({ url: "https://example.com" }).summary).toBe("https://example.com");
  });

  it("unwraps a single-key object", () => {
    expect(formatToolInput({ topic: "AI market" }).summary).toBe("AI market");
    expect(formatToolInput({ count: 3 }).summary).toBe("3");
  });

  it("joins multiple keys, skipping empty values", () => {
    const { summary } = formatToolInput({ a: "x", b: "", c: null, d: 2 });
    expect(summary).toBe("a: x, d: 2");
  });

  it("precedence: query wins over other recognised keys", () => {
    expect(formatToolInput({ query: "q", table_name: "t", url: "u" }).summary).toBe("q");
  });
});
