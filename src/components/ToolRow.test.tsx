import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ToolCall } from "../types";
import { ToolRow } from "./ToolRow";
import { MiniTable } from "./MiniTable";
import { ValueView } from "./ValueView";

describe("ToolRow", () => {
  const failed: ToolCall = {
    toolUseId: "t1",
    toolName: "sql-workbench___run_sql",
    toolInput: { sql: "select * from orders" },
    status: "error",
    toolResult: 'relation "orders" does not exist',
    error: "Table orders not found",
    fix: "List the tables first",
    startedAt: 1000,
    endedAt: 2500,
  };

  it("shows the label, target, status and duration on one line", () => {
    const { container } = render(<ToolRow tool={failed} icon={<span data-testid="tool-icon" />} />);

    expect(screen.getByTestId("tool-icon")).toBeInTheDocument();
    expect(screen.getByText("Run sql")).toBeInTheDocument();
    expect(screen.getByText("select * from orders")).toHaveClass("kaboo-tool-row-summary");
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(container.querySelector(".kaboo-tool-dot-error")).not.toBeNull();
    expect(screen.getByText("1.5s")).toBeInTheDocument();
    expect(screen.queryByText("Table orders not found")).toBeNull();
  });

  it("expands to the error, its fix, the input and the result", () => {
    render(<ToolRow tool={failed} />);
    fireEvent.click(screen.getByRole("button", { expanded: false }));

    expect(screen.getByText("Table orders not found")).toBeInTheDocument();
    expect(screen.getByText("List the tables first")).toBeInTheDocument();
    expect(screen.getByText('relation "orders" does not exist')).toBeInTheDocument();
  });

  it("spins while running and shows no duration yet", () => {
    const { container } = render(<ToolRow tool={{ ...failed, status: "running", toolResult: undefined, error: undefined, endedAt: undefined }} />);

    expect(container.querySelector(".kaboo-tool-spinner")).not.toBeNull();
    expect(container.querySelector(".kaboo-tool-row-duration")).toBeNull();
  });

  it("shows a check without a status word once it succeeded", () => {
    const { container } = render(<ToolRow tool={{ ...failed, status: "success", error: undefined, fix: undefined, toolResult: "[]", endedAt: 1320 }} />);

    expect(container.querySelector(".kaboo-tool-dot-success")).not.toBeNull();
    expect(container.querySelector(".kaboo-tool-row-status")).toBeNull();
    expect(screen.getByText("320ms")).toBeInTheDocument();
  });
});

describe("MiniTable rows", () => {
  it("finds rows under untrusted_content with their columns, and counts the rows left out", () => {
    const { container } = render(
      <ValueView
        value={{
          columns: ["region", "churn"],
          untrusted_content: { rows: [["APAC", 0.071], ["Europe", 0.042]], _truncated: 40 },
          page: { total: 42 },
        }}
      />,
    );

    expect([...container.querySelectorAll("th")].map((th) => th.textContent)).toEqual(["region", "churn"]);
    expect([...container.querySelectorAll("tbody tr")].map((tr) => tr.textContent)).toEqual(["APAC0.071", "Europe0.042"]);
    expect(screen.getByText("+40 more rows")).toBeInTheDocument();
  });

  it("reads per-key _truncated counts and columns inside untrusted_content", () => {
    render(
      <ValueView value={{ untrusted_content: { columns: ["id"], rows: [["a"], ["b"]] }, _truncated: { rows: 3 } }} />,
    );

    expect(screen.getByText("+3 more rows")).toBeInTheDocument();
  });

  it("never shows _truncated as a column, and adds its count to the rows past maxRows", () => {
    const { container } = render(
      <MiniTable rows={[{ id: "1", _truncated: 3 }, { id: "2" }, { id: "3" }]} maxRows={2} truncated={5} />,
    );

    expect([...container.querySelectorAll("th")].map((th) => th.textContent)).toEqual(["id"]);
    expect(screen.getByText("+6 more rows")).toBeInTheDocument();
  });

  it("leaves _truncated out of a field list", () => {
    render(<ValueView value={{ name: "orders", _truncated: { columns: 12 } }} />);

    expect(screen.getByText("orders")).toBeInTheDocument();
    expect(screen.queryByText(/truncated/)).toBeNull();
  });

  it("draws a cut top-level list as its table, with the items left out", () => {
    const { container } = render(
      <ValueView value={{ items: [{ topic: "orders" }, { topic: "payments" }], _truncated: { items: 7 } }} />,
    );

    expect([...container.querySelectorAll("th")].map((th) => th.textContent)).toEqual(["topic"]);
    expect(screen.getByText("+7 more rows")).toBeInTheDocument();
  });
});
