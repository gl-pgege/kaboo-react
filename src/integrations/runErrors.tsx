import type { CopilotKitProps } from "@copilotkit/react-core/v2";
import type { RunError } from "../types";

/** The activity type of the notice {@link KabooMessageView} puts where a run failed. */
export const RUN_ERROR_ACTIVITY = "kaboo-run-error";

type ActivityRenderer = NonNullable<CopilotKitProps["renderActivityMessages"]>[number];

const ANY_CONTENT = {
  "~standard": {
    version: 1 as const,
    vendor: "kaboo",
    validate: (value: unknown) => ({ value }),
  },
};

function RunErrorNotice({ content }: { content: RunError }) {
  return (
    <div className="kaboo-run-error" role="alert">
      <span className="kaboo-run-error-title">This turn stopped with an error.</span>
      <span className="kaboo-run-error-message">{content.message}</span>
    </div>
  );
}

export const runErrorRenderer: ActivityRenderer = {
  activityType: RUN_ERROR_ACTIVITY,
  content: ANY_CONTENT,
  render: RunErrorNotice,
};

export function runErrorMessage(runId: string, error: RunError) {
  return {
    id: `kaboo-run-error:${runId}`,
    role: "activity" as const,
    activityType: RUN_ERROR_ACTIVITY,
    content: { ...error },
  };
}
