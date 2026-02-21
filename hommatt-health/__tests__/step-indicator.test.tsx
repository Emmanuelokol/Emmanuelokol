import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StepIndicator } from "@/components/ui/step-indicator";

describe("StepIndicator", () => {
  it("renders a progressbar with correct aria attributes", () => {
    render(<StepIndicator totalSteps={3} currentStep={0} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "1");
    expect(bar).toHaveAttribute("aria-valuemax", "3");
    expect(bar).toHaveAttribute("aria-label", "Step 1 of 3");
  });

  it("updates aria-valuenow when step changes", () => {
    render(<StepIndicator totalSteps={3} currentStep={2} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-label", "Step 3 of 3");
  });
});
