import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PermissionList } from "./PermissionList";

describe("PermissionList", () => {
  it("lists remembered permissions with their reach and revokes one", () => {
    const onRevoke = vi.fn();
    render(
      <PermissionList
        grants={[
          { id: "g1", tool: "submit_report", label: "Submit reports", threadId: null },
          { id: "g2", tool: "update_price", label: "Update prices", threadId: "t1" },
        ]}
        onRevoke={onRevoke}
      />,
    );

    expect(screen.getByText("Always")).toBeTruthy();
    expect(screen.getByText("This chat")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Revoke Update prices"));
    expect(onRevoke).toHaveBeenCalledWith("g2");
  });

  it("says when there is nothing remembered", () => {
    render(<PermissionList grants={[]} onRevoke={() => {}} emptyText="Nothing allowed yet." />);
    expect(screen.getByText("Nothing allowed yet.")).toBeTruthy();
  });
});
