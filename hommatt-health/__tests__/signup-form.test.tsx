import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SignupForm } from "@/app/auth/signup/signup-form";

// Mock the server action
vi.mock("@/app/auth/signup/actions", () => ({
  submitSignup: vi.fn().mockResolvedValue({ success: true }),
}));

function renderForm() {
  const user = userEvent.setup();
  render(<SignupForm />);
  return { user };
}

describe("SignupForm — Multi-step flow", () => {
  // ─── Step 1: City Selection ───

  it("renders the city selection step first", () => {
    renderForm();
    expect(screen.getByText("Where do you live?")).toBeInTheDocument();
    expect(screen.getByText("Kampala")).toBeInTheDocument();
    expect(screen.getByText("Jinja")).toBeInTheDocument();
  });

  it("shows a step indicator with 3 steps", () => {
    renderForm();
    const indicator = screen.getByRole("progressbar");
    expect(indicator).toHaveAttribute("aria-valuemax", "3");
    expect(indicator).toHaveAttribute("aria-valuenow", "1");
  });

  it("shows validation error when no city selected and Next is pressed", async () => {
    const { user } = renderForm();
    await user.click(screen.getByText("Next"));
    expect(screen.getByRole("alert")).toHaveTextContent("Please select your city or town");
  });

  it("advances to step 2 when a city is selected and Next is pressed", async () => {
    const { user } = renderForm();
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    expect(screen.getByText("Tell us a little about yourself")).toBeInTheDocument();
  });

  // ─── Step 2: Basic Info ───

  it("shows validation errors on step 2 when fields are empty", async () => {
    const { user } = renderForm();
    // Go to step 2
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    // Try to advance without filling anything
    await user.click(screen.getByText("Next"));
    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(1);
  });

  it("advances to step 3 when basic info is filled", async () => {
    const { user } = renderForm();
    // Step 1
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    // Step 2 — fill all fields
    await user.click(screen.getByText("Female"));
    const ageInput = screen.getByLabelText("Age");
    await user.clear(ageInput);
    await user.type(ageInput, "28");
    await user.click(screen.getByText("Single"));
    await user.click(screen.getByText("Next"));
    // Should be on step 3
    expect(
      screen.getByText("Do you have a family you'd like to manage health for?")
    ).toBeInTheDocument();
  });

  // ─── Step 3: Family Question ───

  it("shows family options on step 3", async () => {
    const { user } = renderForm();
    // Navigate to step 3
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Male"));
    const ageInput = screen.getByLabelText("Age");
    await user.clear(ageInput);
    await user.type(ageInput, "35");
    await user.click(screen.getByText("Married"));
    await user.click(screen.getByText("Next"));
    // Verify options
    expect(screen.getByText("Yes, I have a family")).toBeInTheDocument();
    expect(screen.getByText("No, just me for now")).toBeInTheDocument();
    expect(screen.getByText("You can always change this later in Settings.")).toBeInTheDocument();
  });

  it("disables Finish button until a family choice is made", async () => {
    const { user } = renderForm();
    // Navigate to step 3
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Male"));
    const ageInput = screen.getByLabelText("Age");
    await user.clear(ageInput);
    await user.type(ageInput, "35");
    await user.click(screen.getByText("Married"));
    await user.click(screen.getByText("Next"));
    // Finish should be disabled
    expect(screen.getByText("Finish")).toBeDisabled();
  });

  it("submits successfully and shows confirmation", async () => {
    const { user } = renderForm();
    // Step 1
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    // Step 2
    await user.click(screen.getByText("Female"));
    const ageInput = screen.getByLabelText("Age");
    await user.clear(ageInput);
    await user.type(ageInput, "25");
    await user.click(screen.getByText("Single"));
    await user.click(screen.getByText("Next"));
    // Step 3
    await user.click(screen.getByText("No, just me for now"));
    await user.click(screen.getByText("Finish"));
    // Success screen
    expect(await screen.findByText("You're all set!")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Homatt Health. We're glad you're here.")).toBeInTheDocument();
  });

  // ─── Navigation ───

  it("allows going back from step 2 to step 1", async () => {
    const { user } = renderForm();
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    expect(screen.getByText("Tell us a little about yourself")).toBeInTheDocument();
    await user.click(screen.getByText("Back"));
    expect(screen.getByText("Where do you live?")).toBeInTheDocument();
  });

  it("preserves city selection when going back and forward", async () => {
    const { user } = renderForm();
    await user.click(screen.getByText("Gulu"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Back"));
    // Gulu should still be selected (aria-pressed="true")
    const guluBtn = screen.getByText("Gulu");
    expect(guluBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("does not show Back button on step 1", () => {
    renderForm();
    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  // ─── Mobile / Accessibility ───

  it("all city cards meet minimum 48px tap target", () => {
    renderForm();
    const kampalaBtn = screen.getByText("Kampala");
    expect(kampalaBtn.className).toContain("min-h-[48px]");
  });

  it("navigation buttons meet minimum 48px tap target", () => {
    renderForm();
    const nextBtn = screen.getByText("Next");
    expect(nextBtn.className).toContain("min-h-[48px]");
  });

  it("age input uses numeric inputMode for Android keyboards", async () => {
    const { user } = renderForm();
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    const ageInput = screen.getByLabelText("Age");
    expect(ageInput).toHaveAttribute("inputMode", "numeric");
  });
});

describe("SignupForm — Error handling", () => {
  it("shows server error message on submit failure", async () => {
    const actions = await import("@/app/auth/signup/actions");
    vi.mocked(actions.submitSignup).mockResolvedValueOnce({
      success: false,
      error: "Something went wrong. Let's try that again.",
    });

    const user = userEvent.setup();
    render(<SignupForm />);

    // Complete all steps
    await user.click(screen.getByText("Kampala"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Male"));
    const ageInput = screen.getByLabelText("Age");
    await user.clear(ageInput);
    await user.type(ageInput, "30");
    await user.click(screen.getByText("Married"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Yes, I have a family"));
    await user.click(screen.getByText("Finish"));

    expect(
      await screen.findByText("Something went wrong. Let's try that again.")
    ).toBeInTheDocument();
  });
});
