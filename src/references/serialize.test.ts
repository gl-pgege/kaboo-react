import { describe, expect, it } from "vitest";
import {
  attachmentToInputContent,
  buildUserContent,
  mintReferenceId,
  objectToStateEntry,
  referenceMarker,
  serializeReferences,
  withReferenceState,
  type PendingReference,
} from "./serialize";
import { REFERENCE_METADATA_KEYS, REFERENCES_STATE_KEY } from "./types";

const attachment: Extract<PendingReference, { transport: "attachment" }> = {
  transport: "attachment",
  kind: "file",
  id: "file_1",
  name: "report.pdf",
  mimeType: "application/pdf",
  source: { url: "https://cdn.example.com/report.pdf" },
};

const object: Extract<PendingReference, { transport: "object" }> = {
  transport: "object",
  kind: "table",
  id: "table_orders",
  name: "orders",
  meta: { schema: "public" },
};

describe("mintReferenceId", () => {
  it("prefixes with the kind and is unique", () => {
    const a = mintReferenceId("file");
    const b = mintReferenceId("file");
    expect(a.startsWith("file_")).toBe(true);
    expect(a).not.toBe(b);
  });
});

describe("referenceMarker", () => {
  it("encodes kind and id for model correlation", () => {
    expect(referenceMarker(attachment)).toBe("[file:file_1]");
  });
});

describe("attachmentToInputContent", () => {
  it("maps a pdf url source to a document part with kaboo metadata", () => {
    const part = attachmentToInputContent(attachment) as {
      type: string;
      source: { type: string; value: string; mimeType: string };
      metadata: Record<string, unknown>;
    };
    expect(part.type).toBe("document");
    expect(part.source).toEqual({
      type: "url",
      value: "https://cdn.example.com/report.pdf",
      mimeType: "application/pdf",
    });
    expect(part.metadata[REFERENCE_METADATA_KEYS.id]).toBe("file_1");
    expect(part.metadata[REFERENCE_METADATA_KEYS.kind]).toBe("file");
    expect(part.metadata[REFERENCE_METADATA_KEYS.name]).toBe("report.pdf");
    expect(part.metadata.filename).toBe("report.pdf");
  });

  it("maps an image data source to an image part", () => {
    const part = attachmentToInputContent({
      ...attachment,
      mimeType: "image/png",
      source: { data: "aGVsbG8=" },
    }) as { type: string; source: { type: string; value: string } };
    expect(part.type).toBe("image");
    expect(part.source).toEqual({ type: "data", value: "aGVsbG8=", mimeType: "image/png" });
  });
});

describe("objectToStateEntry", () => {
  it("keeps kind/id/name/meta only", () => {
    expect(objectToStateEntry(object)).toEqual({
      kind: "table",
      id: "table_orders",
      name: "orders",
      meta: { schema: "public" },
    });
  });
});

describe("serializeReferences", () => {
  it("splits attachments from objects", () => {
    const { attachmentParts, objectReferences } = serializeReferences([attachment, object]);
    expect(attachmentParts).toHaveLength(1);
    expect(objectReferences).toHaveLength(1);
    expect(objectReferences[0].id).toBe("table_orders");
  });
});

describe("withReferenceState", () => {
  it("sets the references key when present", () => {
    const next = withReferenceState({ existing: 1 }, [objectToStateEntry(object)]);
    expect(next.existing).toBe(1);
    expect(next[REFERENCES_STATE_KEY]).toHaveLength(1);
  });

  it("clears the key when empty so it never leaks into the next turn", () => {
    const next = withReferenceState({ [REFERENCES_STATE_KEY]: [{ id: "x" }] }, []);
    expect(REFERENCES_STATE_KEY in next).toBe(false);
  });
});

describe("buildUserContent", () => {
  it("puts text first then appends attachment parts", () => {
    const parts = buildUserContent("look at @report.pdf", [attachmentToInputContent(attachment)]);
    expect(parts[0]).toEqual({ type: "text", text: "look at @report.pdf" });
    expect((parts[1] as { type: string }).type).toBe("document");
  });

  it("omits an empty text part", () => {
    const parts = buildUserContent("", [attachmentToInputContent(attachment)]);
    expect(parts).toHaveLength(1);
    expect((parts[0] as { type: string }).type).toBe("document");
  });
});
