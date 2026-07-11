/**
 * A single tool invocation captured within an agent's activity group. One
 * `ToolCall` maps to one AG-UI tool-call and carries enough state to render the
 * live tool row, its input summary, and its result (or cancellation).
 */
export interface ToolCall {
  /** AG-UI tool-call id. Stable key used to correlate rows, cards, and gates. */
  toolUseId: string;
  /** The tool's machine name (e.g. `run_sql`, `ask_user`). */
  toolName: string;
  /** Optional human-friendly label shown instead of `toolName`. */
  toolLabel?: string;
  /** The raw tool input (arbitrary JSON), summarized by the formatters. */
  toolInput?: unknown;
  /** The raw tool result, if the call has completed. */
  toolResult?: string;
  /** Lifecycle state of the call, driving the row's icon and status text. */
  status: "running" | "done" | "success" | "error" | "cancelled";
}

/**
 * One chronological entry in an agent's timeline: either a streamed text segment
 * or a tool call, interleaved in the order they occurred.
 */
export type TimelineEntry =
  | {
      /** Discriminator: a streamed text segment. */
      type: "text";
      /** The streamed text for this segment. */
      text: string;
    }
  | {
      /** Discriminator: a tool call. */
      type: "tool";
      /** The tool call for this entry. */
      tool: ToolCall;
    };

/**
 * A single question in a human-in-the-loop form interrupt. `type` selects the
 * input control; `options` supplies the choices for `radio`/`checkbox`.
 */
export interface FormQuestion {
  /** The prompt text shown to the user. */
  question: string;
  /** Which input control to render for this question. */
  type: "radio" | "checkbox" | "text";
  /** Selectable choices for `radio`/`checkbox` questions. */
  options?: string[];
}

/**
 * An approval interrupt: the agent is asking the user to approve or reject a
 * gated tool call before it runs.
 */
export interface ApprovalReason {
  /** Discriminator marking this as an approval gate. */
  type: "approval";
  /** Human-readable description of what is being approved. */
  message: string;
  /** Name of the gated tool awaiting approval. */
  tool_name: string;
  /** The proposed tool input, shown for review. */
  tool_input?: unknown;
}

/**
 * A form interrupt: the agent is asking the user one or more questions and
 * waiting for the answers before it continues.
 */
export interface FormReason {
  /** Discriminator marking this as a form prompt. */
  type: "form";
  /** The questions to present, rendered in order. */
  questions: FormQuestion[];
}

/**
 * The reason a run paused for human input — either an {@link ApprovalReason}
 * (approve/reject a gated tool) or a {@link FormReason} (answer questions).
 */
export type InterruptReason = ApprovalReason | FormReason;

/**
 * A single open interrupt from the AG-UI run, as delivered by CopilotKit.
 * Multiple can be open at once (e.g. parallel gates); each is resolved by `id`.
 */
export interface InterruptData {
  /** Unique interrupt id, used to resolve this gate independently. */
  id: string;
  /** The interrupt's name (typically the originating tool name). */
  name: string;
  /** Why the run paused, and what input it needs. */
  reason: InterruptReason;
}

/**
 * Props for a custom interrupt renderer supplied via `interruptRenderers`.
 * Receives the reason plus resolve/cancel callbacks so a bespoke UI can drive
 * the gate.
 */
export interface InterruptRendererProps {
  /** Why the run paused, and what input it needs. */
  reason: InterruptReason;
  /** Resume the run with the user's answer/approval payload. */
  onResolve: (payload: unknown) => void;
  /** Cancel/reject the gate, resuming the run without a positive answer. */
  onCancel: () => void;
  /**
   * The interrupt's originating tool-call id, when available. Used to correlate
   * the answered form with the durable tool-call card that renders the Q&A
   * inline in the transcript.
   */
  toolCallId?: string;
}

/**
 * One node of kaboo's hierarchical activity tree: a single agent run and its
 * streamed text, tool calls, timeline, structured output, and (optional)
 * open interrupt. Groups nest via {@link StreamGroup.parentGroup} to form the
 * drill-down hierarchy.
 */
export interface StreamGroup {
  /** Display title for the group's card. */
  title: string;
  /** The agent's machine name (used to correlate inline cards). */
  agentName: string;
  /** Parent group id, or `null` for a top-level group. */
  parentGroup: string | null;
  /**
   * The delegating tool-call id (AG-UI `toolCallId`) that spawned this group.
   * Stable key for correlating an inline chat card with its activity group.
   * `null`/absent for the entry agent and non-delegated groups.
   */
  toolCallId?: string | null;
  /**
   * The AG-UI `runId` of the turn that produced this group. `null`/absent for
   * older streams. Note: an interrupt/resume changes the `runId` mid-turn, so
   * prefer {@link StreamGroup.turnId} for turn scoping.
   */
  runId?: string | null;
  /**
   * The logical turn that produced this group — stable across an
   * interrupt/resume (server-stamped). All groups of one user turn share it, so
   * the UI can bind them to that turn's single chat reply without fragmenting
   * on `runId`. `null`/absent for older streams.
   */
  turnId?: string | null;
  /**
   * The task this agent was handed (its latest human/handoff message), shown at
   * the top of the card so you can see what each agent was asked to do.
   */
  task?: string | null;
  /**
   * True when this agent's streamed text IS the chat reply (the swarm/graph
   * `chat_output`, or a delegate manager). Inline cards suppress only this
   * group's text so the answer isn't duplicated between the card and the bubble.
   */
  isChatReply?: boolean;
  /**
   * True for a plain-agent entry group: its text and tool calls are already
   * rendered inline in the chat by the host (CopilotKit), so this group exists
   * only to enrich those tool rows (labels, formatted results, error status)
   * and must never be drawn as its own card.
   */
  inlineChatOwner?: boolean;
  /** Lifecycle state of the group's run. */
  status: "active" | "completed" | "error" | "interrupted";
  /** Every tool call made in this group, in call order. */
  tools: ToolCall[];
  /** Accumulated streamed text tokens for this group. */
  tokens: string;
  /** Interleaved text/tool entries in chronological order. */
  timeline: TimelineEntry[];
  /** The open interrupt for this group, when it is paused for input. */
  interrupt?: InterruptData;
  /** Structured (schema-shaped) output emitted by the agent, if any. */
  structuredOutput?: Record<string, unknown>;
  /** Name of the schema for {@link StreamGroup.structuredOutput}, selecting a renderer. */
  outputSchemaName?: string;
}

/**
 * The full activity snapshot for a conversation: every {@link StreamGroup}
 * keyed by group id. This is what {@link useActivity} exposes.
 */
export interface ActivityState {
  /** All activity groups for the current thread, keyed by group id. */
  groups: Record<string, StreamGroup>;
}

/**
 * Drill-down navigation state: the current path into the activity tree plus the
 * actions to move through it. Exposed by {@link useDrill}.
 */
export interface DrillState {
  /** Group ids from root to the current level. */
  drillPath: string[];
  /** The deepest group id in the path, or `null` at the root. */
  activeDrill: string | null;
  /** Push a group id, descending one level. */
  drillIn: (groupId: string) => void;
  /** Pop the last group id, ascending one level. */
  drillUp: () => void;
  /** Clear the path, returning to the root. */
  drillToRoot: () => void;
  /** Trim the path to `level` (0-based), jumping to a breadcrumb. */
  drillToLevel: (level: number) => void;
}
