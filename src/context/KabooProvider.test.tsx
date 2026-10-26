import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

const { capturedProps, handlerProps } = vi.hoisted(() => ({
  capturedProps: { current: {} as Record<string, unknown> },
  handlerProps: { current: {} as Record<string, unknown> },
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
  KabooInterruptHandler: (props: Record<string, unknown>) => {
    handlerProps.current = props;
    return <div data-testid="interrupt-handler" />;
  },
}));

vi.mock("../integrations/KabooInlineCards", () => ({
  KabooInlineCards: () => <div data-testid="inline-cards" />,
}));

import { KabooProvider } from "./KabooProvider";
import { useRenderOptions } from "./ToolRenderers";
import { MarkdownContent } from "../components/MarkdownContent";

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

  it("hands onInterruptError to the interrupt handler", () => {
    const onInterruptError = vi.fn();
    render(
      <KabooProvider runtimeUrl="/api/copilotkit" agent="entry" onInterruptError={onInterruptError}>
        <div />
      </KabooProvider>,
    );
    expect(handlerProps.current.onInterruptError).toBe(onInterruptError);
    expect(handlerProps.current.agentId).toBe("entry");
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
    expect(capturedProps.current.agentId).toBe("entry");
    expect(capturedProps.current["data-forwarded"]).toBe("yes");
  });

  it("hands its rendering overrides to the cards below", () => {
    const fallbackToolRenderer = () => <div />;
    const renderAgentResult = () => null;
    const isReadOnlyTool = (name: string) => name.startsWith("get_");
    const seen: Record<string, unknown> = {};
    function Probe() {
      Object.assign(seen, useRenderOptions());
      return null;
    }
    render(
      <KabooProvider
        runtimeUrl="/api/copilotkit"
        agent="entry"
        markdownRenderer={(text) => <span data-testid="app-markdown">{text}</span>}
        fallbackToolRenderer={fallbackToolRenderer}
        renderAgentResult={renderAgentResult}
        isReadOnlyTool={isReadOnlyTool}
      >
        <Probe />
        <MarkdownContent text="**hi**" />
      </KabooProvider>,
    );
    expect(screen.getByTestId("app-markdown").textContent).toBe("**hi**");
    expect(seen.fallbackToolRenderer).toBe(fallbackToolRenderer);
    expect(seen.renderAgentResult).toBe(renderAgentResult);
    expect(seen.isReadOnlyTool).toBe(isReadOnlyTool);
  });
});
