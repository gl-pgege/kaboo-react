import { describe, expect, it } from "vitest";
import { askUserParameters } from "./askUser";
import { openRequestCalls } from "./openRequests";
import { checkArguments, toolSchema } from "./schema";

describe("the ask_user schema", () => {
  it("accepts questions with and without options", () => {
    const args = { questions: [{ question: "Which region?", options: ["Europe", "APAC"] }, { question: "Why?" }] };
    expect(checkArguments(askUserParameters, args)).toEqual({ value: args });
  });

  it("names every problem so the agent can correct the call", () => {
    expect(checkArguments(askUserParameters, { questions: [] })).toEqual({
      error: "questions must be a list of at least one question",
    });
    expect(
      checkArguments(askUserParameters, { questions: [{ question: " ", options: "Europe", multiple: "yes" }] }),
    ).toEqual({
      error:
        "questions.0.question must be a non-empty string; questions.0.options must be a list of strings; " +
        "questions.0.multiple must be true or false",
    });
  });

  it("describes itself to the agent as JSON Schema", () => {
    const schema = askUserParameters["~standard"].jsonSchema.input() as {
      required: string[];
      properties: { questions: { items: { required: string[] } } };
    };
    expect(schema.required).toEqual(["questions"]);
    expect(schema.properties.questions.items.required).toEqual(["question"]);
  });
});

describe("checkArguments", () => {
  it("joins issue paths from any Standard Schema", () => {
    const schema = {
      "~standard": {
        version: 1 as const,
        vendor: "test",
        validate: () => ({ issues: [{ message: "Required", path: ["files", { key: 0 }, "name"] }] }),
      },
    };
    expect(checkArguments(schema, {})).toEqual({ error: "files.0.name: Required" });
  });

  it("builds a schema from JSON Schema and a check", () => {
    const schema = toolSchema<{ n: number }>({ type: "object" }, (value) =>
      typeof (value as { n?: unknown }).n === "number" ? [] : ["n must be a number"],
    );
    expect(checkArguments(schema, { n: 1 })).toEqual({ value: { n: 1 } });
    expect(checkArguments(schema, { n: "1" })).toEqual({ error: "n must be a number" });
  });
});

describe("openRequestCalls", () => {
  it("finds unanswered requests, sub-agents' included", () => {
    const call = (id: string, name: string) => ({ id, type: "function" as const, function: { name, arguments: "{}" } });
    const messages = [
      { id: "a1", role: "assistant" as const, toolCalls: [call("q1", "ask_user"), call("s1", "run_sql")] },
      { id: "r1", role: "tool" as const, toolCallId: "s1", content: "rows" },
      { id: "a2", role: "assistant" as const, toolCalls: [call("q2", "ask_user")], subagentRunId: "sub-a" },
      { id: "a3", role: "assistant" as const, toolCalls: [call("q3", "ask_user")] },
      { id: "r3", role: "tool" as const, toolCallId: "q3", content: "{}" },
    ];
    expect(openRequestCalls(messages, (name) => name === "ask_user")).toEqual(["q1", "q2"]);
  });
});
