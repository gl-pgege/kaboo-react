import { isRecord } from "./value";

const TASK_KEYS = ["input", "task", "question", "narrative", "brief", "request", "message"];

export function taskSummary(task: string): string {
  if (!task.trimStart().startsWith("{")) return task;
  let value: unknown;
  try {
    value = JSON.parse(task);
  } catch {
    return task;
  }
  if (!isRecord(value)) return task;
  for (const key of TASK_KEYS) {
    const text = value[key];
    if (typeof text === "string" && text.trim()) return text;
  }
  const fields = Object.entries(value)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim() !== "" && entry[1].length <= 120)
    .map(([key, text]) => `${key.replace(/_/g, " ")}: ${text}`);
  return fields.length > 0 ? fields.join(" · ") : task;
}
