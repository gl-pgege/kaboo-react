import { describe, it, expect } from "vitest";
import { cachedShare, formatCost, formatTokenCount, promptTokens } from "./tokens";

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
  it("returns the share of the whole prompt read from the cache", () => {
    expect(
      cachedShare({
        inputTokens: 332_236,
        cacheReadInputTokens: 660_933,
        cacheWriteInputTokens: 50_841,
      }),
    ).toBe(63);
    expect(
      cachedShare({ inputTokens: 168_107, cacheReadInputTokens: 111_817 }),
    ).toBe(40);
  });

  it("is 100 when the whole prompt came from the cache", () => {
    expect(cachedShare({ inputTokens: 0, cacheReadInputTokens: 5 })).toBe(100);
  });

  it("counts the whole prompt as input", () => {
    expect(
      promptTokens({ inputTokens: 100, cacheReadInputTokens: 300, cacheWriteInputTokens: 100 }),
    ).toBe(500);
    expect(promptTokens({ inputTokens: 100 })).toBe(100);
  });

  it("returns null without cache reads", () => {
    expect(cachedShare({ inputTokens: 100 })).toBeNull();
    expect(
      cachedShare({ inputTokens: 100, cacheReadInputTokens: 0, cacheWriteInputTokens: 50 }),
    ).toBeNull();
  });
});
