import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { CopilotChatInput, useAgent, useCopilotChatConfiguration } from "@copilotkit/react-core/v2";
import { useReferences } from "./ReferencesProvider";
import { isUploadProvider, uploadFileToReference, UPLOAD_MARKER } from "./uploadProvider";
import { buildUserContent, serializeReferences } from "./serialize";
import type { PendingReference, ReferenceItem, ReferenceProvider } from "./types";

type CopilotInputProps = ComponentProps<typeof CopilotChatInput>;
type TextAreaSlotProps = ComponentProps<typeof CopilotChatInput.TextArea>;

/**
 * Props for {@link KabooReferenceInput}. This is a drop-in value for
 * `<CopilotChat input={…}>`, so it receives every prop CopilotKit hands the
 * input slot (value, onChange, onSubmitMessage, …) plus a couple of
 * kaboo-specific knobs.
 */
export interface KabooReferenceInputProps extends CopilotInputProps {
  /** Character that opens the reference popover from the editor. Default `"@"`. */
  trigger?: string;
}

// One row in the shared popover.
type Row =
  | { kind: "action"; group: string; provider: ReferenceProvider }
  | { kind: "item"; group: string; provider: ReferenceProvider; item: ReferenceItem };

const CHIP_CLASS = "kaboo-chip";
const NBSP = "\u00A0";

const AT_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>';
const FILE_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
const X_SVG =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

const AttachIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);
const AtIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);
const PlusIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5v14" />
  </svg>
);
const SearchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

interface PopoverPosition {
  left: number;
  bottom: number;
  width: number;
}

const POPOVER_WIDTH = 320;
const VIEWPORT_MARGIN = 8;
const ANCHOR_GAP = 6;

/** Place the popover just above an anchor rect, left-aligned and clamped on-screen. */
function computePosition(rect: DOMRect | null): PopoverPosition | null {
  if (!rect) return null;
  const width = Math.min(POPOVER_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
  const left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(rect.left, window.innerWidth - width - VIEWPORT_MARGIN),
  );
  return { left, bottom: window.innerHeight - rect.top + ANCHOR_GAP, width };
}

function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

function previewSrc(ref: Extract<PendingReference, { transport: "attachment" }>): string {
  return "url" in ref.source ? ref.source.url : `data:${ref.mimeType};base64,${ref.source.data}`;
}

/** Serialize the editor DOM to the plain string CopilotKit sends: text with
 *  object chips as `@name` and file chips as their filename. */
function serializeEditor(root: HTMLElement): string {
  let out = "";
  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? "";
      return;
    }
    if (node instanceof HTMLElement) {
      if (node.classList.contains(CHIP_CLASS)) {
        const name = node.dataset.name ?? "";
        out += node.dataset.transport === "object" ? `@${name}` : name;
        return;
      }
      if (node.tagName === "BR") {
        out += "\n";
        return;
      }
      if (node.tagName === "DIV" && out.length > 0 && !out.endsWith("\n")) out += "\n";
      node.childNodes.forEach(walk);
    }
  };
  root.childNodes.forEach(walk);
  return out.replace(new RegExp(NBSP, "g"), " ");
}

/**
 * A `<CopilotChat input={…}>` slot that keeps CopilotKit's native input chrome
 * (send button, disclaimer, theme, layout) but replaces the plain textarea with
 * a lightweight rich editor. References — your objects (via `@`) and files (via
 * the `+` button or the "attach a file" row) — render as interactive inline
 * chips: click a chip to swap it for another, or its `×` to remove it. The `+`
 * and `@` triggers open the *same* searchable popover. Object references ride
 * `state.kaboo_references` (agent sees them inline as `@name`); files ride the
 * message as attachment parts (agent is made aware via the manifest). On submit
 * the editor builds the multimodal message and runs the agent.
 *
 * @example
 * ```tsx
 * <KabooProvider references={[uploadProvider({ onUpload }), tableProvider]} …>
 *   <CopilotChat input={KabooReferenceInput} />
 * </KabooProvider>
 * ```
 */
export function KabooReferenceInput({ trigger = "@", ...inputProps }: KabooReferenceInputProps) {
  const {
    providers,
    pending,
    addReference,
    removeReference,
    clearReferences,
    recordMessageReferences,
  } = useReferences();
  const config = useCopilotChatConfiguration();
  const configAgentId = (config as { agentId?: string } | null)?.agentId;
  const { agent } = useAgent(configAgentId ? { agentId: configAgentId } : undefined);
  const placeholder =
    (config as { labels?: { chatInputPlaceholder?: string } } | null)?.labels
      ?.chatInputPlaceholder ?? "Type a message...";

  const wrapRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addBtnRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const nativeChangeRef = useRef<((e: ChangeEvent<HTMLTextAreaElement>) => void) | undefined>(undefined);
  const anchorRef = useRef<() => DOMRect | null>(() => null);
  // The `@…` token being edited (contentEditable text node + start offset).
  const tokenRef = useRef<{ node: Text; start: number } | null>(null);
  // An inline chip currently being replaced (click-to-swap), if any.
  const replacingRef = useRef<HTMLElement | null>(null);
  // A tray reference id currently being replaced (click-to-swap), if any.
  const replacingTrayIdRef = useRef<string | null>(null);
  // Ids of references rendered inline (via `@`); everything else lives in the
  // tray. `+` never inserts inline — that's what distinguishes the two.
  const inlineIdsRef = useRef<Set<string>>(new Set());
  // Where the next selection lands: inline (from `@`) or the tray (from `+`).
  const commitTargetRef = useRef<"inline" | "tray">("inline");

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"token" | "menu">("token");
  const [pos, setPos] = useState<PopoverPosition | null>(null);

  const placeholderRef = useRef(placeholder);
  placeholderRef.current = placeholder;

  // Toggle the placeholder (contentEditable has no native one) via a DOM
  // attribute, so the editor node never has to re-render/remount.
  const markEmpty = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;
    const isEmpty =
      root.querySelector(`.${CHIP_CLASS}`) === null && (root.textContent ?? "").trim().length === 0;
    root.dataset.empty = isEmpty ? "true" : "false";
  }, []);

  const uploadProviderDef = useMemo(() => providers.find(isUploadProvider), [providers]);
  const searchable = useMemo(() => providers.filter((p) => typeof p.search === "function"), [providers]);
  const actionProviders = useMemo(
    () => providers.filter((p) => typeof p.search !== "function"),
    [providers],
  );

  const buildRows = useCallback(
    async (q: string): Promise<Row[]> => {
      const next: Row[] = [];
      for (const provider of actionProviders) {
        const label = isUploadProvider(provider) ? "Attach" : provider.label;
        if (!q || label.toLowerCase().includes(q.toLowerCase())) {
          next.push({ kind: "action", group: label, provider });
        }
      }
      for (const provider of searchable) {
        try {
          const items = await provider.search!(q);
          for (const item of items) next.push({ kind: "item", group: provider.label, provider, item });
        } catch {
          /* a provider's search failure shouldn't break the menu */
        }
      }
      return next;
    },
    [actionProviders, searchable],
  );

  const refresh = useCallback(
    async (q: string) => {
      const next = await buildRows(q);
      setRows(next);
      setActive(0);
    },
    [buildRows],
  );

  const close = useCallback(() => {
    setOpen(false);
    setRows([]);
    setQuery("");
    tokenRef.current = null;
    replacingRef.current = null;
    replacingTrayIdRef.current = null;
  }, []);

  // Push the serialized editor text into CopilotKit's controlled value.
  const emit = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;
    const text = serializeEditor(root);
    markEmpty();
    nativeChangeRef.current?.({ target: { value: text } } as ChangeEvent<HTMLTextAreaElement>);
  }, [markEmpty]);

  // Drop any *inline* reference whose chip the user deleted by editing. Tray
  // references (added via `+`) are never in the editor DOM, so leave them be.
  const reconcile = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;
    const live = new Set(
      Array.from(root.querySelectorAll<HTMLElement>(`.${CHIP_CLASS}`)).map((c) => c.dataset.refId),
    );
    for (const id of Array.from(inlineIdsRef.current)) {
      if (!live.has(id)) {
        inlineIdsRef.current.delete(id);
        removeReference(id);
      }
    }
  }, [removeReference]);

  const focusEditor = useCallback(() => editorRef.current?.focus(), []);

  // Build a chip DOM node with icon/preview, label, and a remove button.
  const createChip = useCallback((ref: PendingReference): HTMLElement => {
    const chip = document.createElement("span");
    chip.className = `${CHIP_CLASS} ${CHIP_CLASS}-${ref.transport}`;
    chip.contentEditable = "false";
    chip.dataset.refId = ref.id;
    chip.dataset.kind = ref.kind;
    chip.dataset.name = ref.name;
    chip.dataset.transport = ref.transport;
    chip.title = ref.name;

    if (ref.transport === "attachment" && isImageMime(ref.mimeType)) {
      const img = document.createElement("img");
      img.className = "kaboo-chip-thumb";
      img.src = previewSrc(ref);
      img.alt = ref.name;
      chip.appendChild(img);
    } else {
      const ic = document.createElement("span");
      ic.className = "kaboo-chip-ic";
      ic.innerHTML = ref.transport === "object" ? AT_SVG : FILE_SVG;
      chip.appendChild(ic);
    }

    const label = document.createElement("span");
    label.className = "kaboo-chip-label";
    label.textContent = ref.name;
    chip.appendChild(label);

    const x = document.createElement("button");
    x.type = "button";
    x.className = "kaboo-chip-x";
    x.setAttribute("aria-label", `Remove ${ref.name}`);
    x.innerHTML = X_SVG;
    x.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handlersRef.current.removeChip(chip);
    });
    chip.appendChild(x);

    chip.addEventListener("mousedown", (e) => {
      if (e.target === x || x.contains(e.target as Node)) return;
      e.preventDefault();
      handlersRef.current.replaceChip(chip);
    });
    return chip;
  }, []);

  // Insert a node at the current selection (falls back to end of the editor).
  const insertAtCaret = useCallback((node: Node) => {
    const root = editorRef.current;
    if (!root) return;
    const sel = window.getSelection();
    let range: Range;
    if (sel && sel.rangeCount > 0 && root.contains(sel.focusNode)) {
      range = sel.getRangeAt(0);
    } else {
      range = document.createRange();
      range.selectNodeContents(root);
      range.collapse(false);
    }
    range.collapse(false);
    const space = document.createTextNode(NBSP);
    range.insertNode(space);
    range.insertNode(node);
    const after = document.createRange();
    after.setStartAfter(space);
    after.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(after);
  }, []);

  // Place a chip: replacing an existing one, dropping an `@` token, or at caret.
  const placeChip = useCallback(
    (ref: PendingReference) => {
      const chip = createChip(ref);
      const replacing = replacingRef.current;
      if (replacing) {
        const oldId = replacing.dataset.refId;
        if (oldId && oldId !== ref.id) removeReference(oldId);
        replacing.replaceWith(chip);
        replacingRef.current = null;
      } else if (tokenRef.current) {
        const { node, start } = tokenRef.current;
        const sel = window.getSelection();
        const range = document.createRange();
        range.setStart(node, Math.min(start, node.textContent?.length ?? 0));
        if (sel && sel.focusNode && editorRef.current?.contains(sel.focusNode)) {
          range.setEnd(sel.focusNode, sel.focusOffset);
        } else {
          range.setEnd(node, node.textContent?.length ?? 0);
        }
        range.deleteContents();
        const space = document.createTextNode(NBSP);
        range.insertNode(space);
        range.insertNode(chip);
        const after = document.createRange();
        after.setStartAfter(space);
        after.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(after);
        tokenRef.current = null;
      } else {
        insertAtCaret(chip);
      }
      emit();
    },
    [createChip, insertAtCaret, removeReference, emit],
  );

  // Stage a chosen reference either inline (in the editor) or in the tray.
  const commit = useCallback(
    (ref: PendingReference, target: "inline" | "tray") => {
      addReference(ref);
      if (target === "inline") {
        inlineIdsRef.current.add(ref.id);
        placeChip(ref);
      } else {
        const oldId = replacingTrayIdRef.current;
        if (oldId && oldId !== ref.id) removeReference(oldId);
        replacingTrayIdRef.current = null;
        inlineIdsRef.current.delete(ref.id);
      }
    },
    [addReference, placeChip, removeReference],
  );

  // Open the file picker; the chosen file is uploaded then staged.
  const openFilePicker = useCallback(
    (provider: ReferenceProvider, target: "inline" | "tray") => {
      const input = fileInputRef.current;
      if (!input) return;
      const cfg = isUploadProvider(provider) ? provider[UPLOAD_MARKER] : {};
      input.accept = (cfg as { accept?: string }).accept ?? "";
      input.onchange = async () => {
        const file = input.files?.[0];
        input.value = "";
        if (!file) return;
        try {
          const ref = await uploadFileToReference(file, cfg as Parameters<typeof uploadFileToReference>[1]);
          commit(ref, target);
        } catch (err) {
          console.error("[kaboo] upload failed", err);
        }
      };
      input.click();
    },
    [commit],
  );

  // Remove the "@…" token that opened the menu (before an async upload).
  const stripToken = useCallback(() => {
    const t = tokenRef.current;
    if (!t) return;
    const sel = window.getSelection();
    const range = document.createRange();
    range.setStart(t.node, Math.min(t.start, t.node.textContent?.length ?? 0));
    if (sel?.focusNode && editorRef.current?.contains(sel.focusNode)) {
      range.setEnd(sel.focusNode, sel.focusOffset);
    } else {
      range.setEnd(t.node, t.node.textContent?.length ?? 0);
    }
    range.deleteContents();
    emit();
  }, [emit]);

  const select = useCallback(
    async (row: Row) => {
      // Capture target before close() resets it.
      const target = commitTargetRef.current;
      if (row.kind === "action") {
        const provider = row.provider;
        if (target === "inline") stripToken();
        close();
        if (isUploadProvider(provider)) openFilePicker(provider, target);
        else await provider.onSelect?.({ id: provider.id, label: provider.label });
        focusEditor();
        return;
      }
      // Commit (consumes token/replacing) *before* close() clears them.
      await row.provider.onSelect?.(row.item);
      const ref = row.provider.toReference?.(row.item);
      if (ref) commit(ref, target);
      close();
      focusEditor();
    },
    [stripToken, close, openFilePicker, focusEditor, commit],
  );

  // Open the popover anchored at the `@` caret.
  const openFromToken = useCallback(
    (q: string) => {
      commitTargetRef.current = "inline";
      replacingRef.current = null;
      replacingTrayIdRef.current = null;
      anchorRef.current = () => {
        const t = tokenRef.current;
        return t ? caretRectFor(t.node, t.start) : null;
      };
      setMode("token");
      setQuery(q);
      setPos(computePosition(anchorRef.current()));
      setOpen(true);
      void refresh(q);
    },
    [refresh],
  );

  // Toggle the popover from the `+` button (menu mode: has its own search box).
  const toggleFromButton = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        close();
        return false;
      }
      commitTargetRef.current = "tray";
      tokenRef.current = null;
      replacingRef.current = null;
      replacingTrayIdRef.current = null;
      anchorRef.current = () => addBtnRef.current?.getBoundingClientRect() ?? null;
      setMode("menu");
      setQuery("");
      setPos(computePosition(anchorRef.current()));
      void refresh("");
      return true;
    });
  }, [refresh, close]);

  const onSearch = useCallback(
    (value: string) => {
      setQuery(value);
      void refresh(value);
    },
    [refresh],
  );

  const handleNavKey = useCallback(
    (e: ReactKeyboardEvent): boolean => {
      if (!open || rows.length === 0) return false;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % rows.length);
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + rows.length) % rows.length);
        return true;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        void select(rows[active]);
        return true;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        focusEditor();
        return true;
      }
      return false;
    },
    [open, rows, active, select, close, focusEditor],
  );

  // Click an inline chip to swap it: open the menu anchored to that chip.
  const replaceChip = useCallback(
    (chip: HTMLElement) => {
      commitTargetRef.current = "inline";
      replacingRef.current = chip;
      replacingTrayIdRef.current = null;
      tokenRef.current = null;
      anchorRef.current = () => chip.getBoundingClientRect();
      setMode("menu");
      setQuery("");
      setPos(computePosition(chip.getBoundingClientRect()));
      setOpen(true);
      void refresh("");
    },
    [refresh],
  );

  // Click a tray chip to swap it: open the menu anchored to that chip.
  const replaceTrayChip = useCallback(
    (id: string, anchorEl: HTMLElement) => {
      commitTargetRef.current = "tray";
      replacingTrayIdRef.current = id;
      replacingRef.current = null;
      tokenRef.current = null;
      anchorRef.current = () => anchorEl.getBoundingClientRect();
      setMode("menu");
      setQuery("");
      setPos(computePosition(anchorEl.getBoundingClientRect()));
      setOpen(true);
      void refresh("");
    },
    [refresh],
  );

  const removeChip = useCallback(
    (chip: HTMLElement) => {
      const id = chip.dataset.refId;
      const next = chip.nextSibling;
      chip.remove();
      if (next && next.nodeType === Node.TEXT_NODE && next.textContent === NBSP) next.remove();
      if (id) {
        inlineIdsRef.current.delete(id);
        removeReference(id);
      }
      emit();
      focusEditor();
    },
    [removeReference, emit, focusEditor],
  );

  const handlersRef = useRef({ removeChip, replaceChip });
  handlersRef.current = { removeChip, replaceChip };

  const ctl = { open, rows, active, trigger, openFromToken, toggleFromButton, close, handleNavKey };
  const ctlRef = useRef(ctl);
  ctlRef.current = ctl;

  // Read the `@…` token at the caret, if any.
  const readToken = useCallback((): { node: Text; start: number; query: string } | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return null;
    const node = sel.focusNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.textContent ?? "";
    const before = text.slice(0, sel.focusOffset);
    const at = before.lastIndexOf(ctlRef.current.trigger);
    if (at < 0) return null;
    const prev = at > 0 ? before[at - 1] : "";
    if (prev && !/\s/.test(prev)) return null;
    const q = before.slice(at + 1);
    if (/\s/.test(q)) return null;
    return { node: node as Text, start: at, query: q };
  }, []);

  const onEditorInput = useCallback(() => {
    reconcile();
    emit();
    const token = readToken();
    if (token) {
      tokenRef.current = { node: token.node, start: token.start };
      const c = ctlRef.current;
      if (!c.open || mode === "token") openFromToken(token.query);
      else {
        setQuery(token.query);
        void refresh(token.query);
      }
    } else if (ctlRef.current.open && mode === "token") {
      close();
    }
  }, [reconcile, emit, readToken, openFromToken, refresh, mode, close]);

  const TextAreaSlot = useMemo(
    () =>
      forwardRef<HTMLTextAreaElement, TextAreaSlotProps>(function KabooRefEditor(props, ref) {
        const { onChange, onKeyDown, className, autoFocus } = props as TextAreaSlotProps & {
          className?: string;
          autoFocus?: boolean;
        };
        nativeChangeRef.current = onChange as
          | ((e: ChangeEvent<HTMLTextAreaElement>) => void)
          | undefined;

        const setRefs = (node: HTMLDivElement | null) => {
          editorRef.current = node;
          if (typeof ref === "function") ref(node as unknown as HTMLTextAreaElement);
          else if (ref) (ref as RefObject<HTMLTextAreaElement | null>).current = node as unknown as HTMLTextAreaElement;
        };

        const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
          if (ctlRef.current.handleNavKey(e)) return;
          onKeyDown?.(e as unknown as ReactKeyboardEvent<HTMLTextAreaElement>);
        };

        return (
          <div
            ref={setRefs}
            role="textbox"
            aria-multiline="true"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholderRef.current}
            className={`kaboo-ref-editor cpk:bg-transparent cpk:outline-none cpk:antialiased cpk:leading-relaxed cpk:text-[16px] ${className ?? ""}`}
            data-empty="true"
            autoFocus={autoFocus}
            onInput={onEditorInput}
            onKeyDown={handleKeyDown}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const AddMenuButtonSlot = useMemo(
    () =>
      function KabooRefAddButton(props: { disabled?: boolean }) {
        return (
          <button
            ref={addBtnRef}
            type="button"
            className="kaboo-ref-add"
            aria-label="Add attachment or reference"
            aria-haspopup="listbox"
            aria-expanded={ctlRef.current.open}
            disabled={props.disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => ctlRef.current.toggleFromButton()}
          >
            {PlusIcon}
          </button>
        );
      },
    [],
  );

  // Dismiss on outside-click / Escape (menu is portaled outside the wrapper).
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKey);
    };
  }, [open, close]);

  // Keep the portaled menu pinned to its anchor as layout shifts.
  useEffect(() => {
    if (!open) return;
    const reposition = () => setPos(computePosition(anchorRef.current()));
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    setPos(computePosition(anchorRef.current()));
    if (mode === "menu") searchRef.current?.focus();
  }, [open, mode, rows.length]);

  // Clear staged references once a run has actually started (not on send), so
  // object refs on `state.kaboo_references` survive the in-flight run.
  useEffect(() => {
    const target = agent as unknown as {
      subscribe?: (s: Record<string, unknown>) => { unsubscribe?: () => void };
    } | null;
    if (!target || typeof target.subscribe !== "function") return;
    const sub = target.subscribe({ onRunStartedEvent: () => clearReferences() });
    return () => sub?.unsubscribe?.();
  }, [agent, clearReferences]);

  // Clear the editor DOM when CopilotKit resets the value (after a send).
  useEffect(() => {
    const root = editorRef.current;
    if (!root) return;
    if ((inputProps.value ?? "") === "" && root.childNodes.length > 0) {
      root.textContent = "";
      markEmpty();
    }
  }, [inputProps.value, markEmpty]);

  // Build the multimodal message and run the agent ourselves (files ride as
  // attachment parts; object refs travel on state.kaboo_references).
  const handleSubmit = useCallback(
    (message: string) => {
      const text = message.trim();
      const { attachmentParts } = serializeReferences(pending);
      const target = agent as unknown as {
        addMessage?: (m: unknown) => void;
        runAgent?: () => Promise<unknown> | void;
      } | null;
      if (text.length === 0 && attachmentParts.length === 0) return;
      if (!target?.addMessage || !target.runAgent) {
        // Fallback: let CopilotKit's own send handle plain text.
        (inputProps.onSubmitMessage as ((m: string) => void) | undefined)?.(message);
        close();
        return;
      }
      const content =
        attachmentParts.length > 0 ? buildUserContent(text, attachmentParts) : text;
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      // Object references ride state, not the message content, so record them
      // against this message id for the bubble to render them as chips.
      recordMessageReferences(
        id,
        pending.filter((r) => r.transport === "object"),
      );
      target.addMessage({ id, role: "user", content });
      void Promise.resolve(target.runAgent()).catch((err) =>
        console.error("[kaboo] runAgent failed", err),
      );
      const root = editorRef.current;
      if (root) root.textContent = "";
      markEmpty();
      close();
    },
    [pending, agent, inputProps, close, markEmpty, recordMessageReferences],
  );

  // Tray = staged references not rendered inline (added via `+`).
  const trayRefs = pending.filter((r) => !inlineIdsRef.current.has(r.id));

  // CopilotKit centers the input pill independently of our wrapper, so align
  // the tray's box to the pill (`.copilotKitInput`) rather than the wrapper.
  useLayoutEffect(() => {
    const tray = trayRef.current;
    const wrap = wrapRef.current;
    if (!tray || !wrap) return;
    const align = () => {
      const pill = wrap.querySelector<HTMLElement>(".copilotKitInput");
      if (!pill) return;
      const pr = pill.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      tray.style.marginLeft = `${Math.max(0, pr.left - wr.left)}px`;
      tray.style.width = `${pr.width}px`;
    };
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [trayRefs.length]);

  return (
    <div ref={wrapRef} className="kaboo-ref-input">
      <input ref={fileInputRef} type="file" className="kaboo-ref-file" tabIndex={-1} aria-hidden="true" />
      {trayRefs.length > 0 && (
        <div ref={trayRef} className="kaboo-ref-tray">
          {trayRefs.map((r) => (
            <TrayChip
              key={r.id}
              reference={r}
              onRemove={() => removeReference(r.id)}
              onReplace={(el) => replaceTrayChip(r.id, el)}
            />
          ))}
        </div>
      )}
      <CopilotChatInput
        {...inputProps}
        onSubmitMessage={handleSubmit}
        textArea={TextAreaSlot}
        addMenuButton={AddMenuButtonSlot}
      />
      {open &&
        pos &&
        createPortal(
          <ReferencePopover
            ref={menuRef}
            pos={pos}
            rows={rows}
            active={active}
            query={query}
            mode={mode}
            searchRef={searchRef}
            hasUpload={!!uploadProviderDef}
            onSearch={onSearch}
            onSearchKeyDown={handleNavKey}
            onHover={setActive}
            onPick={select}
          />,
          document.body,
        )}
    </div>
  );
}

/** A staged reference shown in the tray (added via `+`, not inline). */
function TrayChip({
  reference,
  onRemove,
  onReplace,
}: {
  reference: PendingReference;
  onRemove: () => void;
  onReplace: (anchor: HTMLElement) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isImage = reference.transport === "attachment" && isImageMime(reference.mimeType);
  return (
    <span
      ref={ref}
      className={`kaboo-chip ${CHIP_CLASS}-${reference.transport} kaboo-chip-tray`}
      title={reference.name}
      role="button"
      tabIndex={0}
      onMouseDown={(e) => {
        e.preventDefault();
        if (ref.current) onReplace(ref.current);
      }}
    >
      {isImage ? (
        <img
          className="kaboo-chip-thumb"
          src={previewSrc(reference as Extract<PendingReference, { transport: "attachment" }>)}
          alt={reference.name}
        />
      ) : (
        <span className="kaboo-chip-ic">{reference.transport === "object" ? AtIcon : AttachIcon}</span>
      )}
      <span className="kaboo-chip-label">{reference.name}</span>
      <button
        type="button"
        className="kaboo-chip-x"
        aria-label={`Remove ${reference.name}`}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

/** Caret rect for a text node offset (mirror-measured like getCaretRect). */
function caretRectFor(node: Text, offset: number): DOMRect | null {
  try {
    const range = document.createRange();
    range.setStart(node, Math.min(offset, node.textContent?.length ?? 0));
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    if (rect.top === 0 && rect.left === 0) {
      const parent = node.parentElement;
      return parent ? parent.getBoundingClientRect() : null;
    }
    return rect;
  } catch {
    return null;
  }
}

const ReferencePopover = forwardRef<
  HTMLDivElement,
  {
    pos: PopoverPosition;
    rows: Row[];
    active: number;
    query: string;
    mode: "token" | "menu";
    searchRef: RefObject<HTMLInputElement | null>;
    hasUpload: boolean;
    onSearch: (value: string) => void;
    onSearchKeyDown: (e: ReactKeyboardEvent) => boolean;
    onHover: (i: number) => void;
    onPick: (row: Row) => void;
  }
>(function ReferencePopover(
  { pos, rows, active, query, mode, searchRef, onSearch, onSearchKeyDown, onHover, onPick },
  ref,
) {
  return (
    <div
      ref={ref}
      className="kaboo-refmenu"
      role="listbox"
      style={{ left: pos.left, bottom: pos.bottom, width: pos.width }}
    >
      {mode === "menu" && (
        <div className="kaboo-refmenu-search">
          <span className="kaboo-refmenu-search-icon">{SearchIcon}</span>
          <input
            ref={searchRef}
            type="text"
            className="kaboo-refmenu-search-input"
            placeholder="Search…"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => onSearchKeyDown(e)}
          />
        </div>
      )}
      {rows.length === 0 && <div className="kaboo-refmenu-empty">No matches</div>}
      {rows.map((row, i) => {
        const key = row.kind === "action" ? `action:${row.provider.id}` : `${row.provider.id}:${row.item.id}`;
        const showHeader = i === 0 || rows[i - 1].group !== row.group;
        const isUpload = row.kind === "action" && isUploadProvider(row.provider);
        const icon: ReactNode = isUpload
          ? AttachIcon
          : row.kind === "item"
            ? (row.provider.icon ?? AtIcon)
            : (row.provider.icon ?? AtIcon);
        const title =
          row.kind === "action" ? (isUpload ? "Attach a file" : row.provider.label) : row.item.label;
        const subtitle =
          row.kind === "action"
            ? isUpload
              ? "Upload from your device"
              : undefined
            : row.item.description;
        const custom = row.kind === "item" ? row.provider.renderItem?.(row.item) : undefined;
        return (
          <div key={key}>
            {showHeader && <div className="kaboo-refmenu-group">{row.group}</div>}
            <div
              role="option"
              aria-selected={i === active}
              className={`kaboo-refmenu-item${i === active ? " is-active" : ""}`}
              onMouseEnter={() => onHover(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(row);
              }}
            >
              <span className="kaboo-refmenu-icon">{icon}</span>
              {custom ?? (
                <span className="kaboo-refmenu-text">
                  <span className="kaboo-refmenu-title">{title}</span>
                  {subtitle && <span className="kaboo-refmenu-sub">{subtitle}</span>}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
