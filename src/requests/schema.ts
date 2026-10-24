/** One problem with a tool call's arguments. */
export interface KabooSchemaIssue {
  /** What is wrong, in words the model can act on. */
  readonly message: string;
  /** Where in the arguments, as Standard Schema reports it. */
  readonly path?: ReadonlyArray<
    | PropertyKey
    | {
        /** One step of the path. */
        readonly key: PropertyKey;
      }
  >;
}

/** What a {@link KabooToolSchema} check returns: the value, or its problems. */
export type KabooValidationResult<T> =
  | {
      /** The valid value. */
      readonly value: T;
      /** Never set on a valid value. */
      readonly issues?: undefined;
    }
  | {
      /** The problems with the value. */
      readonly issues: ReadonlyArray<KabooSchemaIssue>;
    };

/** The fields a Standard Schema carries under `~standard`. */
export interface KabooStandardProps<T> {
  /** The Standard Schema version. */
  readonly version: 1;
  /** The library that made the schema. */
  readonly vendor: string;
  /** Check a value. kaboo-react supports synchronous checks only. */
  readonly validate: (value: unknown) => KabooValidationResult<T> | Promise<KabooValidationResult<T>>;
  /** The input and output types, for inference. */
  readonly types?: {
    /** The input type. */
    readonly input: unknown;
    /** The output type. */
    readonly output: T;
  };
}

/**
 * A browser tool's arguments schema: any Standard Schema, such as a zod
 * schema. CopilotKit turns it into the JSON Schema the agent sees, and
 * kaboo-react checks every call against it before showing it.
 */
export interface KabooToolSchema<T> {
  /** The Standard Schema fields. */
  readonly "~standard": KabooStandardProps<T>;
}

/** A {@link KabooToolSchema} that also carries the JSON Schema the agent sees. */
export interface KabooJsonToolSchema<T> extends KabooToolSchema<T> {
  /** The Standard Schema fields, with the JSON Schema. */
  readonly "~standard": KabooStandardProps<T> & {
    /** The JSON Schema of the tool's arguments. */
    readonly jsonSchema: {
      /** The input's JSON Schema. */
      readonly input: () => object;
      /** The output's JSON Schema. */
      readonly output: () => object;
    };
  };
}

/**
 * Build a {@link KabooToolSchema} from a JSON Schema and a check, for apps
 * that describe a tool without a schema library.
 *
 * @param jsonSchema - What the agent sees.
 * @param check - The problems with a value, as messages; none when it is valid.
 *
 * @example
 * ```ts
 * import { toolSchema } from "@pgege/kaboo-react";
 *
 * const pickColor = toolSchema<{ color: string }>(
 *   { type: "object", properties: { color: { type: "string" } }, required: ["color"] },
 *   (value) => (typeof (value as { color?: unknown })?.color === "string" ? [] : ["color must be a string"]),
 * );
 * ```
 */
export function toolSchema<T>(
  jsonSchema: Record<string, unknown>,
  check: (value: unknown) => string[],
): KabooJsonToolSchema<T> {
  return {
    "~standard": {
      version: 1,
      vendor: "kaboo",
      validate: (value: unknown) => {
        const problems = check(value);
        return problems.length > 0
          ? { issues: problems.map((message) => ({ message })) }
          : { value: value as T };
      },
      jsonSchema: { input: () => jsonSchema, output: () => jsonSchema },
    },
  };
}

function describePath(path: KabooSchemaIssue["path"]): string {
  if (!path || path.length === 0) return "";
  return path
    .map((part) => String(typeof part === "object" && part !== null ? part.key : part))
    .join(".");
}

/**
 * Check a tool call's arguments against its schema.
 *
 * @returns The arguments when valid, or the problems as one message the model
 * can act on. `undefined` while an asynchronous check is pending, which
 * kaboo-react does not support: keep browser tool schemas synchronous.
 */
export function checkArguments<T>(
  schema: KabooToolSchema<T>,
  value: unknown,
):
  | {
      /** The valid arguments. */
      value: T;
    }
  | {
      /** The problems, as one message the model can act on. */
      error: string;
    }
  | undefined {
  const result = schema["~standard"].validate(value);
  if (result instanceof Promise) return undefined;
  if (result.issues) {
    const problems = result.issues.map((issue) => {
      const where = describePath(issue.path);
      return where ? `${where}: ${issue.message}` : issue.message;
    });
    return { error: problems.join("; ") };
  }
  return { value: result.value };
}
