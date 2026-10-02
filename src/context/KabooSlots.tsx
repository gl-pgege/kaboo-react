import { createContext, useContext, type ComponentType, type ReactNode } from "react";
import type { GroupEntry } from "../utils/groups";

/**
 * A chat message as the slot renderers receive it (CopilotKit's message shape,
 * loosely typed so hosts can read whatever fields their runtime provides).
 */
export interface SlotMessage {
  /** The message id. */
  id?: string;
  /** The message role (`"user"`, `"assistant"`, ...). */
  role?: string;
  /** The message content (string or content parts, per the runtime). */
  content?: unknown;
  [key: string]: unknown;
}

/** Context handed to a {@link KabooSlots.turnFooter} renderer. */
export interface TurnFooterContext {
  /** Id of the turn's final assistant message (the footer's anchor). */
  messageId: string;
  /** The anchor message itself. */
  message: SlotMessage;
  /** Every activity group the turn produced (roots and nested), in stream order. */
  groups: GroupEntry[];
  /**
   * OpenTelemetry trace id of the turn's root run, when the workflow service
   * ran with telemetry enabled. Hosts use this to attach feedback scores to
   * the exact trace. Absent when telemetry is off.
   */
  traceId?: string;
}

/**
 * App-supplied render slots for the chat surfaces. kaboo-react renders nothing
 * in these positions by default — each slot is pure mechanism, letting hosts
 * attach their own policy (end-of-turn artifact cards, timestamps, run-start
 * indicators) without the library forcing an opinion.
 *
 * Provide them once on {@link KabooProvider} (or per-view on
 * `KabooMessageView`, which takes precedence).
 */
export interface KabooSlots {
  /**
   * Rendered once per completed turn, after the turn's final assistant
   * message, with every activity group that turn produced. The natural home
   * for end-of-turn artifact cards (e.g. "here's the dashboard this turn
   * built"), derived from `structuredOutput` on the turn's groups.
   */
  turnFooter?: (ctx: TurnFooterContext) => ReactNode;
  /** Rendered under each user message bubble (e.g. a timestamp row). */
  userMessageFooter?: (message: SlotMessage) => ReactNode;
  /** Rendered under each assistant message (e.g. a timestamp row). */
  assistantMessageFooter?: (message: SlotMessage) => ReactNode;
  /**
   * Rendered while a run is in flight until the current turn's first activity
   * group appears (a swarm/graph member or a delegated agent, active or
   * finished), covering the gap right after send where the UI otherwise looks
   * idle. Groups from earlier turns don't count. The current turn is the one
   * the latest user message started, read from its `kaboo.message_meta`
   * event; without that event the indicator hides while any group is active.
   * Defaults to CopilotKit's streaming cursor.
   */
  runStartIndicator?: ComponentType;
}

const KabooSlotsContext = createContext<KabooSlots>({});

/** Provide {@link KabooSlots} to the chat surfaces below. */
export function KabooSlotsProvider({ value, children }: { value: KabooSlots; children: ReactNode }) {
  return <KabooSlotsContext.Provider value={value}>{children}</KabooSlotsContext.Provider>;
}

/** Read the nearest {@link KabooSlots}. */
export function useKabooSlots(): KabooSlots {
  return useContext(KabooSlotsContext);
}
