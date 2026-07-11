import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

const { capturedProps } = vi.hoisted(() => ({
  capturedProps: { current: {} as Record<string, unknown> },
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  CopilotKit: ({ children, ...props }: { children: ReactNode }) => {
    capturedProps.current = props;
    return <div data-testid="copilotkit">{children}</div>;
  },
  useAgent: () => ({
    agent: { subscribe: () => ({ unsubscribe: () => {} }) },
  }),
}));

vi.mock("../integrations/KabooInterruptHandler", () => ({
  KabooInterruptHandler: () => <div data-testid="interrupt-handler" />,
}));

vi.mock("../integrations/KabooInlineCards", () => ({
  KabooInlineCards: () => <div data-testid="inline-cards" />,
}));

import { KabooProvider } from "./KabooProvider";

beforeEach(() => {
  capturedProps.current = {};
});

describe("KabooProvider", () => {
  it("renders CopilotKit, children, and both built-in handlers by default", () => {
    render(
      <KabooProvider runtimeUrl="/api/copilotkit" agent="entry" threadId="t1">
        <div data-testid="child">hi</div>
      </KabooProvider>,
    );
    expect(screen.getByTestId("copilotkit")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("interrupt-handler")).toBeInTheDocument();
    expect(screen.getByTestId("inline-cards")).toBeInTheDocument();
  });

  it("skips the interrupt handler when disabled", () => {
    render(
      <KabooProvider
        runtimeUrl="/api/copilotkit"
        agent="entry"
        disableInterruptHandler
      >
        <div />
      </KabooProvider>,
    );
    expect(screen.queryByTestId("interrupt-handler")).toBeNull();
    expect(screen.getByTestId("inline-cards")).toBeInTheDocument();
  });

  it("skips inline cards when disabled", () => {
    render(
      <KabooProvider runtimeUrl="/api/copilotkit" agent="entry" disableInlineCards>
        <div />
      </KabooProvider>,
    );
    expect(screen.queryByTestId("inline-cards")).toBeNull();
    expect(screen.getByTestId("interrupt-handler")).toBeInTheDocument();
  });

  it("forwards runtimeUrl and copilotKitProps to CopilotKit", () => {
    render(
      <KabooProvider
        runtimeUrl="/api/copilotkit"
        agent="entry"
        threadId="t1"
        copilotKitProps={{ "data-forwarded": "yes" } as Record<string, unknown>}
      >
        <div />
      </KabooProvider>,
    );
    expect(capturedProps.current.runtimeUrl).toBe("/api/copilotkit");
    expect(capturedProps.current.agent).toBe("entry");
    expect(capturedProps.current["data-forwarded"]).toBe("yes");
  });
});
