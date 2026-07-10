export interface ToolCall {
  toolUseId: string;
  toolName: string;
  toolLabel?: string;
  toolInput?: unknown;
  toolResult?: string;
  status: "running" | "done" | "success" | "error" | "cancelled";
}

export type TimelineEntry =
  | { type: "text"; text: string }
  | { type: "tool"; tool: ToolCall };

export interface FormQuestion {
  question: string;
  type: "radio" | "checkbox" | "text";
  options?: string[];
}

export interface ApprovalReason {
  type: "approval";
  message: string;
  tool_name: string;
  tool_input?: unknown;
}

export interface FormReason {
  type: "form";
  questions: FormQuestion[];
}

export type InterruptReason = ApprovalReason | FormReason;

export interface InterruptData {
  id: string;
  name: string;
  reason: InterruptReason;
}

export interface InterruptRendererProps {
  reason: InterruptReason;
  onResolve: (payload: unknown) => void;
  onCancel: () => void;
  /**
   * The interrupt's originating tool-call id, when available. Used to correlate
   * the answered form with the durable tool-call card that renders the Q&A
   * inline in the transcript.
   */
  toolCallId?: string;
}

export interface StreamGroup {
  title: string;
  agentName: string;
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
   * prefer {@link turnId} for turn scoping.
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
  status: "active" | "completed" | "error" | "interrupted";
  tools: ToolCall[];
  tokens: string;
  timeline: TimelineEntry[];
  interrupt?: InterruptData;
  structuredOutput?: Record<string, unknown>;
  outputSchemaName?: string;
}

export interface ActivityState {
  groups: Record<string, StreamGroup>;
}

export interface DrillState {
  drillPath: string[];
  activeDrill: string | null;
  drillIn: (groupId: string) => void;
  drillUp: () => void;
  drillToRoot: () => void;
  drillToLevel: (level: number) => void;
}
