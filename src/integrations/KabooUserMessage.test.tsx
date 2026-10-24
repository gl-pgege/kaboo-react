import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { CopilotChatUserMessageProps } from "@copilotkit/react-core/v2";
import { KabooUserMessage } from "./KabooUserMessage";
import { MessageMetaContext } from "../context/MessageMeta";

const message = {
  id: "m1",
  role: "user",
  content: [
    { type: "text", text: "Why did @Revenue drop?" },
    {
      type: "image",
      source: { type: "url", value: "https://example.com/chart.png", mimeType: "image/png" },
      metadata: { filename: "chart.png" },
    },
  ],
} as unknown as CopilotChatUserMessageProps["message"];

describe("KabooUserMessage", () => {
  it("renders in CopilotKit's own message, with each reference once", () => {
    const { container } = render(
      <MessageMetaContext.Provider value={{ m1: { references: [{ id: "r1", name: "Revenue" }] } }}>
        <KabooUserMessage message={message} />
      </MessageMetaContext.Provider>,
    );

    const wrapper = container.querySelector('[data-message-id="m1"]');
    expect(wrapper?.className).toContain("copilotKitUserMessage");
    expect(wrapper?.className).toContain("kaboo-user-message");

    expect(container.querySelectorAll(".kaboo-chip-attachment")).toHaveLength(1);
    expect(container.querySelectorAll("img")).toHaveLength(1);

    const inline = container.querySelector(".kaboo-msg-chip-inline");
    expect(inline?.textContent).toBe("Revenue");
    expect(inline?.parentElement?.textContent).toBe("Why did Revenue drop?");
  });
});
