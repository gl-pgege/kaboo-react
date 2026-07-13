export type {
  ToolCall, TimelineEntry, StreamGroup, ActivityState, DrillState,
  FormQuestion, ApprovalReason, FormReason, InterruptReason,
  InterruptData, InterruptRendererProps,
} from "./types";

export { KabooActivityProvider, StructuredRenderersContext } from "./context/ActivityProvider";
export type { KabooActivityProviderProps, StructuredRenderers } from "./context/ActivityProvider";
export { DrillProvider } from "./context/DrillContext";
export { KabooProvider } from "./context/KabooProvider";
export type { KabooProviderProps } from "./context/KabooProvider";
export {
  InterruptBridgeProvider,
  InterruptBridgePublisher,
  useInterruptBridge,
  useInterruptFor,
} from "./context/InterruptBridge";
export type { ActiveInterrupt } from "./context/InterruptBridge";

export { useActivity } from "./hooks/useActivity";
export { useDrill } from "./hooks/useDrill";

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

export { ActivityPanel } from "./components/ActivityPanel";
export { AgentCard } from "./components/AgentCard";
export type { AgentCardProps } from "./components/AgentCard";
export { ToolRow } from "./components/ToolRow";
export { MiniTable } from "./components/MiniTable";
export { GlassTabs } from "./components/GlassTabs";
export { DrillDetailView } from "./components/DrillDetailView";
export { MarkdownContent } from "./components/MarkdownContent";
export { InterruptRenderer } from "./components/InterruptRenderer";
export { Timeline } from "./components/Timeline";
export type { TimelineProps } from "./components/Timeline";

export { formatToolInput } from "./formatters/input";
export { formatToolResult, normalizeResult } from "./formatters/output";
