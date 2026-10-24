import { toolSchema } from "./schema";

/** The question tool's name, as agents' `client_tools` allow-lists name it. */
export const ASK_USER_TOOL = "ask_user";

/** One question the agent asks. */
export interface AskUserQuestion {
  /** The question, in one short sentence. */
  question: string;
  /** The choices offered; the person can always answer in their own words. */
  options?: string[];
  /** Whether the person may pick more than one option. */
  multiple?: boolean;
}

/** The question tool's arguments. */
export interface AskUserArgs {
  /** The questions, in the order to ask them. */
  questions: AskUserQuestion[];
}

/** What the agent reads about the question tool. */
export const ASK_USER_DESCRIPTION =
  "Ask the person one or more short questions and wait for their answers. " +
  "Use it only when you cannot go on without their input. Offer options when " +
  "there are obvious choices; the person can always type their own answer. " +
  "The answers come back as JSON keyed by question.";

const ASK_USER_JSON_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      minItems: 1,
      description: "The questions, in the order to ask them.",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The question, in one short sentence." },
          options: {
            type: "array",
            items: { type: "string" },
            description: "Choices to offer.",
          },
          multiple: {
            type: "boolean",
            description: "Whether the person may pick more than one option.",
          },
        },
        required: ["question"],
      },
    },
  },
  required: ["questions"],
};

function checkAskUser(value: unknown): string[] {
  const questions = (value as { questions?: unknown } | null)?.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    return ["questions must be a list of at least one question"];
  }
  const problems: string[] = [];
  questions.forEach((raw, index) => {
    const question = raw as Partial<Record<keyof AskUserQuestion, unknown>> | null;
    if (typeof question?.question !== "string" || question.question.trim() === "") {
      problems.push(`questions.${index}.question must be a non-empty string`);
    }
    if (
      question?.options !== undefined &&
      !(Array.isArray(question.options) && question.options.every((option) => typeof option === "string"))
    ) {
      problems.push(`questions.${index}.options must be a list of strings`);
    }
    if (question?.multiple !== undefined && typeof question.multiple !== "boolean") {
      problems.push(`questions.${index}.multiple must be true or false`);
    }
  });
  return problems;
}

/** The question tool's arguments schema. */
export const askUserParameters = toolSchema<AskUserArgs>(ASK_USER_JSON_SCHEMA, checkAskUser);
