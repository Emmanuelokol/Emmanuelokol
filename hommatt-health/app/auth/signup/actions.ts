import { signupSchema, type SignupData } from "@/lib/validations/signup";

interface SubmitResult {
  success: boolean;
  error?: string;
}

export async function submitSignup(data: SignupData): Promise<SubmitResult> {
  // Validate at the server boundary
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid data";
    return { success: false, error: firstError };
  }

  // In production this writes to Supabase via the service client.
  // For Phase 1 we validate and acknowledge — the DB write is wired
  // once Supabase environment variables are configured.
  //
  // Example:
  // const supabase = createServerClient(...)
  // const { error } = await supabase.from("profiles").insert({
  //   id: user.id,
  //   ...parsed.data,
  //   onboarding_completed: true,
  // })

  console.log("[signup] Profile data validated:", parsed.data);

  return { success: true };
}
