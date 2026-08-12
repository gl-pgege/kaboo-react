import { describe, it, expect } from "vitest";
import { cachedShare, formatCost, formatTokenCount } from "./tokens";

describe("formatTokenCount", () => {
  it("keeps counts under 1000 as-is", () => {
    expect(formatTokenCount(0)).toBe("0");
    expect(formatTokenCount(950)).toBe("950");
  });

  it("abbreviates thousands with one decimal, dropping trailing .0", () => {
    expect(formatTokenCount(12_400)).toBe("12.4k");
    expect(formatTokenCount(2_000)).toBe("2k");
    expect(formatTokenCount(48_231)).toBe("48.2k");
  });

  it("abbreviates millions", () => {
    expect(formatTokenCount(1_230_000)).toBe("1.2M");
  });

  it("tolerates non-finite input", () => {
    expect(formatTokenCount(Number.NaN)).toBe("0");
  });
});

describe("formatCost", () => {
  it("formats dollars to two decimals", () => {
    expect(formatCost(2.14159)).toBe("$2.14");
    expect(formatCost(0.163068)).toBe("$0.16");
  });

  it("floors sub-cent costs to a marker", () => {
    expect(formatCost(0.0009)).toBe("<$0.01");
  });

  it("treats zero, negative, and non-finite as $0.00", () => {
    expect(formatCost(0)).toBe("$0.00");
    expect(formatCost(-1)).toBe("$0.00");
    expect(formatCost(Number.NaN)).toBe("$0.00");
  });
});

describe("cachedShare", () => {
  it("returns the rounded percentage of cached input tokens", () => {
    expect(
      cachedShare({ inputTokens: 168_107, cacheReadInputTokens: 111_817 }),
    ).toBe(67);
  });

  it("returns null without cache accounting or input tokens", () => {
    expect(cachedShare({ inputTokens: 100 })).toBeNull();
    expect(cachedShare({ inputTokens: 100, cacheReadInputTokens: 0 })).toBeNull();
    expect(cachedShare({ inputTokens: 0, cacheReadInputTokens: 5 })).toBeNull();
  });
});
