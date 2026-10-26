import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownContent } from "./MarkdownContent";
import { ToolRenderersProvider } from "../context/ToolRenderers";

describe("MarkdownContent", () => {
  it("renders a GitHub-flavored table", () => {
    const { container } = render(
      <MarkdownContent text={"Churn by region:\n\n| Region | Churn |\n|---|---:|\n| APAC | 7.1% |\n| Europe | 4.2% |"} />,
    );

    const table = container.querySelector("table.kaboo-md-table");
    expect(table).not.toBeNull();
    expect([...table!.querySelectorAll("th")].map((th) => th.textContent)).toEqual(["Region", "Churn"]);
    expect([...table!.querySelectorAll("tbody tr")].map((tr) => tr.textContent)).toEqual(["APAC7.1%", "Europe4.2%"]);
    expect(container.textContent).not.toContain("|");
  });

  it("never shows a literal ** while bold text is still streaming", () => {
    const { container, rerender } = render(<MarkdownContent text={"Findings:\n\n- **"} />);
    expect(container.textContent).not.toContain("**");

    rerender(<MarkdownContent text={"Findings:\n\n- **Revenue grew"} />);
    expect(container.textContent).not.toContain("**");
    expect(container.querySelector("li strong")?.textContent).toBe("Revenue grew");

    rerender(<MarkdownContent text={"Findings:\n\n- **Revenue grew** 12% and **"} />);
    expect(container.textContent).not.toContain("**");
  });

  it("renders numbered lists, inline code, code blocks and links", () => {
    const { container } = render(
      <MarkdownContent
        text={"1. Find the table\n2. Query it\n\nRun `select 1`, see [the docs](https://example.com/docs).\n\n```sql\nselect 2\n```"}
      />,
    );

    expect(container.querySelectorAll("ol.kaboo-md-ol > li")).toHaveLength(2);
    expect(container.querySelector("p code.kaboo-md-code")?.textContent).toBe("select 1");
    expect(container.querySelector("pre.kaboo-md-pre")?.textContent).toBe("select 2\n");
    const link = screen.getByRole("link", { name: "the docs" });
    expect(link).toHaveAttribute("href", "https://example.com/docs");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("hands the text to the app's markdownRenderer when one is given", () => {
    const { container } = render(
      <ToolRenderersProvider markdownRenderer={(text) => <span data-testid="app-markdown">{text.toUpperCase()}</span>}>
        <MarkdownContent text="**hello**" />
      </ToolRenderersProvider>,
    );

    expect(screen.getByTestId("app-markdown").textContent).toBe("**HELLO**");
    expect(container.querySelector(".kaboo-md")).toBeNull();
  });
});
