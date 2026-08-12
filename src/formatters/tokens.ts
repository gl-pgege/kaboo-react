/**
 * Formats a token count for compact display: `950` -> `"950"`,
 * `12_400` -> `"12.4k"`, `1_230_000` -> `"1.2M"`. Trailing `.0` is dropped
 * (`2_000` -> `"2k"`).
 *
 * @example
 * ```ts
 * import { formatTokenCount } from "@pgege/kaboo-react";
 *
 * formatTokenCount(48231); // "48.2k"
 * ```
 */
export function formatTokenCount(count: number): string {
  if (!Number.isFinite(count)) return "0";
  const abs = Math.abs(count);
  if (abs < 1000) return String(count);
  const scaled = abs < 1_000_000 ? count / 1000 : count / 1_000_000;
  const suffix = abs < 1_000_000 ? "k" : "M";
  const text = scaled.toFixed(1).replace(/\.0$/, "");
  return `${text}${suffix}`;
}

/**
 * Formats a dollar cost for compact display: `2.14159` -> `"$2.14"`,
 * `0.163` -> `"$0.16"`, values below half a cent -> `"<$0.01"`.
 *
 * @example
 * ```ts
 * import { formatCost } from "@pgege/kaboo-react";
 *
 * formatCost(0.163068); // "$0.16"
 * ```
 */
export function formatCost(cost: number): string {
  if (!Number.isFinite(cost) || cost <= 0) return "$0.00";
  if (cost < 0.005) return "<$0.01";
  return `$${cost.toFixed(2)}`;
}

/**
 * Returns the cached share of input tokens as a whole percentage
 * (`0`–`100`), or `null` when the usage carries no cache accounting or no
 * input tokens.
 *
 * @example
 * ```ts
 * import { cachedShare } from "@pgege/kaboo-react";
 *
 * cachedShare({ inputTokens: 100, outputTokens: 0, totalTokens: 100, cacheReadInputTokens: 92 }); // 92
 * ```
 */
export function cachedShare(usage: {
  inputTokens: number;
  cacheReadInputTokens?: number;
}): number | null {
  const cached = usage.cacheReadInputTokens;
  if (!cached || !usage.inputTokens) return null;
  return Math.round((cached / usage.inputTokens) * 100);
}
