import { describe, it, expect, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType } from "react";

vi.mock("@copilotkit/react-core/v2", () => ({
  // Only the two slots matter here: the add button opens the menu, and the
  // editor slot has to exist for the component to mount.
  CopilotChatInput: (props: {
    addMenuButton: ComponentType<{ disabled?: boolean }>;
    textArea: ComponentType<Record<string, unknown>>;
  }) => {
    const Add = props.addMenuButton;
    const Editor = props.textArea;
    return (
      <div>
        <Add />
        <Editor />
      </div>
    );
  },
  useAgent: () => ({ agent: null }),
  useCopilotChatConfiguration: () => null,
}));

import { KabooReferenceInput } from "./ReferenceInput";
import { ReferencesProvider } from "./ReferencesProvider";
import type { ReferenceItem, ReferenceProvider } from "./types";

/** A provider whose searches only resolve when the test says so. */
function deferredProvider(id: string) {
  const pending: Array<{
    query: string;
    resolve: (items: ReferenceItem[]) => void;
  }> = [];
  const provider: ReferenceProvider = {
    id,
    label: id,
    search: (query) =>
      new Promise<ReferenceItem[]>((resolve) => {
        pending.push({ query, resolve });
      }),
  };
  const settle = (query: string, labels: string[]) => {
    const match = pending.find((p) => p.query === query);
    if (!match) throw new Error(`no pending search for "${query}"`);
    match.resolve(labels.map((label) => ({ id: label, label })));
  };
  return { provider, settle, pending };
}

function renderInput(providers: ReferenceProvider[]) {
  return render(
    <ReferencesProvider providers={providers}>
      <KabooReferenceInput />
    </ReferencesProvider>,
  );
}

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByLabelText("Add attachment or reference"));
  return screen.findByPlaceholderText("Search…");
}

function optionLabels(): string[] {
  return screen
    .queryAllByRole("option")
    .map((row) => row.textContent ?? "")
    .filter((text) => text.length > 0);
}

describe("KabooReferenceInput menu", () => {
  it("keeps the rows for the query the user typed last", async () => {
    const user = userEvent.setup();
    const slow = deferredProvider("slow");
    renderInput([slow.provider]);
    const search = await openMenu(user);
    slow.settle("", []);

    await user.type(search, "a");
    await user.type(search, "b");
    await waitFor(() => expect(slow.pending).toHaveLength(3));

    // The stale search answers last, which is the whole point of the guard.
    slow.settle("ab", ["b result"]);
    await waitFor(() => expect(optionLabels()).toEqual(["b result"]));
    await act(async () => {
      slow.settle("a", ["a result"]);
    });

    expect(optionLabels()).toEqual(["b result"]);
  });

  it("searches every provider at once rather than one after another", async () => {
    const user = userEvent.setup();
    const first = deferredProvider("first");
    const second = deferredProvider("second");
    renderInput([first.provider, second.provider]);
    await openMenu(user);

    // Both are in flight before either answers; a sequential loop would leave
    // the second provider unqueried until the first resolved.
    await waitFor(() => {
      expect(first.pending).toHaveLength(1);
      expect(second.pending).toHaveLength(1);
    });

    first.settle("", ["from first"]);
    second.settle("", ["from second"]);
    await waitFor(() =>
      expect(optionLabels()).toEqual(["from first", "from second"]),
    );
  });

  it("still lists the providers that answered when one search throws", async () => {
    const user = userEvent.setup();
    const healthy = deferredProvider("healthy");
    const broken: ReferenceProvider = {
      id: "broken",
      label: "broken",
      search: () => Promise.reject(new Error("provider is down")),
    };
    renderInput([broken, healthy.provider]);
    await openMenu(user);

    healthy.settle("", ["still here"]);
    await waitFor(() => expect(optionLabels()).toEqual(["still here"]));
  });
});
