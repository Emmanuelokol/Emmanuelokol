import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SelectCard } from "@/components/ui/select-card";

describe("SelectCard", () => {
  it("renders with the correct label", () => {
    render(<SelectCard label="Kampala" selected={false} onSelect={() => {}} />);
    expect(screen.getByText("Kampala")).toBeInTheDocument();
  });

  it("shows aria-pressed=true when selected", () => {
    render(<SelectCard label="Kampala" selected={true} onSelect={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("shows aria-pressed=false when not selected", () => {
    render(<SelectCard label="Kampala" selected={false} onSelect={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect when tapped", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SelectCard label="Kampala" selected={false} onSelect={onSelect} />);
    await user.click(screen.getByText("Kampala"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("has the selected styling when selected", () => {
    render(<SelectCard label="Kampala" selected={true} onSelect={() => {}} />);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-emerald-600");
    expect(btn.className).toContain("bg-emerald-50");
  });

  it("meets minimum 48px tap target height", () => {
    render(<SelectCard label="Kampala" selected={false} onSelect={() => {}} />);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("min-h-[48px]");
  });
});
