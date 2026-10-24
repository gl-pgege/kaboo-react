export type {
  ToolCall, TimelineEntry, StreamGroup, ActivityState, DrillState,
  FormQuestion, ApprovalReason, FormReason, InterruptReason,
  InterruptData, InterruptRendererProps, MessageMeta, TokenUsage,
  ApprovalScope, ApprovalSubject, ApprovalDecision, CustomRequestReason,
} from "./types";

export { KabooActivityProvider, StructuredRenderersContext } from "./context/ActivityProvider";
export type { KabooActivityProviderProps, StructuredRenderers } from "./context/ActivityProvider";
export { useMessageMeta, MESSAGE_META_EVENT } from "./context/MessageMeta";
export { KabooSlotsProvider, useKabooSlots } from "./context/KabooSlots";
export type { KabooSlots, TurnFooterContext, SlotMessage } from "./context/KabooSlots";
export { useTurnGroups } from "./context/TurnBinding";
export { DrillProvider } from "./context/DrillContext";
export { KabooProvider } from "./context/KabooProvider";
export type { KabooProviderProps } from "./context/KabooProvider";
export {
  InterruptRenderersProvider,
  useInterruptRenderer,
  useApprovalScopes,
} from "./context/InterruptRenderers";
export type { InterruptRenderers } from "./context/InterruptRenderers";
export {
  ToolRenderersProvider,
  useToolRenderer,
} from "./context/ToolRenderers";
export type { ToolRenderers, ToolRendererProps } from "./context/ToolRenderers";

export { useActivity } from "./hooks/useActivity";
export { useDrill } from "./hooks/useDrill";
export { useKabooSend } from "./hooks/useKabooSend";
export { useAgentPresence, useAgentState, useLiveToolCalls } from "./hooks/canvas";
export type { AgentPresence, LiveToolCall } from "./hooks/canvas";
export type { KabooSendOptions, KabooUserContent } from "./hooks/useKabooSend";
export { useRequestTool } from "./requests/useRequestTool";
export type {
  KabooRequestRenderProps,
  KabooRequestStatus,
  KabooRequestToolOptions,
} from "./requests/useRequestTool";
export { useAskUserTool, AskUserPanel } from "./requests/useAskUserTool";
export type { UseAskUserToolOptions } from "./requests/useAskUserTool";
export { ASK_USER_DESCRIPTION, ASK_USER_TOOL, askUserParameters } from "./requests/askUser";
export type { AskUserArgs, AskUserQuestion } from "./requests/askUser";
export { checkArguments, toolSchema } from "./requests/schema";
export type {
  KabooJsonToolSchema,
  KabooSchemaIssue,
  KabooStandardProps,
  KabooToolSchema,
  KabooValidationResult,
} from "./requests/schema";
export { MOVED_ON_ANSWER, SKIPPED_ANSWER, openRequestCalls } from "./requests/openRequests";

export { useTurnFeedback, resolveTurnIds } from "./feedback/useTurnFeedback";
export type {
  FeedbackPayload,
  FeedbackHandler,
  TurnFeedbackState,
} from "./feedback/useTurnFeedback";
export { TurnFeedback } from "./feedback/TurnFeedback";
export type { TurnFeedbackProps } from "./feedback/TurnFeedback";

export { ReferencesProvider, ReferenceStateSync, useReferences } from "./references/ReferencesProvider";
export type { ReferencesContextValue, ReferencesProviderProps } from "./references/ReferencesProvider";
export { KabooReferenceInput } from "./references/ReferenceInput";
export type { KabooReferenceInputProps } from "./references/ReferenceInput";
export {
  uploadProvider,
  isUploadProvider,
  buildAttachmentsConfig,
  uploadFileToReference,
  UPLOAD_MARKER,
} from "./references/uploadProvider";
export type { UploadProviderConfig, UploadReferenceProvider } from "./references/uploadProvider";
export {
  mintReferenceId,
  referenceMarker,
  attachmentToInputContent,
  objectToStateEntry,
  serializeReferences,
  withReferenceState,
  buildUserContent,
} from "./references/serialize";
export type { SerializedObjectReference, SerializedReferences } from "./references/serialize";
export {
  REFERENCE_METADATA_KEYS,
  REFERENCES_STATE_KEY,
} from "./references/types";
export type {
  ReferenceProvider,
  ReferenceItem,
  PendingReference,
  ReferenceTransport,
} from "./references/types";
export { topLevelGroups, directChildren } from "./utils/groups";
export type { GroupEntry } from "./utils/groups";
export { resolveTimelineTool, timelineToolUseId } from "./utils/timeline";

export { ActivityPanel } from "./components/ActivityPanel";
export { AgentCard } from "./components/AgentCard";
export type { AgentCardProps } from "./components/AgentCard";
export { ToolRow } from "./components/ToolRow";
export { MiniTable } from "./components/MiniTable";
export { GlassTabs } from "./components/GlassTabs";
export { DrillDetailView } from "./components/DrillDetailView";
export { MarkdownContent } from "./components/MarkdownContent";
export { InterruptRenderer } from "./components/InterruptRenderer";
export { ApprovalActions, useApprovalDecision } from "./components/ApprovalActions";
export type { ApprovalDecisionControls } from "./components/ApprovalActions";
export { PermissionList } from "./components/PermissionList";
export type { PermissionListProps, RememberedPermission } from "./components/PermissionList";
export { Timeline } from "./components/Timeline";
export type { TimelineProps } from "./components/Timeline";

export { buildAnswerPayload, toFormQuestion } from "./formatters/askUser";
export { formatToolInput } from "./formatters/input";
export { formatToolResult, normalizeResult } from "./formatters/output";
export { cachedShare, formatCost, formatTokenCount } from "./formatters/tokens";
