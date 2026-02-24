import { z } from "zod";

console.log("[signup-validation] Module loading, zod version:", z.version ?? "unknown");

/** Uganda phone: +256 followed by 9 digits */
const ugandaPhoneRegex = /^\+256[0-9]{9}$/;

let phoneStepSchema: ReturnType<typeof z.object>;
let infoStepSchema: ReturnType<typeof z.object>;
let conditionsStepSchema: ReturnType<typeof z.object>;
let signupSchema: ReturnType<typeof z.object>;

try {
  phoneStepSchema = z.object({
    phone_number: z
      .string()
      .min(1, "Please enter your phone number")
      .regex(ugandaPhoneRegex, "Enter a valid Uganda number like +256 7XX XXX XXX"),
  });
  console.log("[signup-validation] phoneStepSchema created OK");

  infoStepSchema = z.object({
    sex: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please select one" }),
    }),
    city: z.string().min(1, "Please select your city"),
    dob: z.string().min(1, "Please select your date of birth"),
  });
  console.log("[signup-validation] infoStepSchema created OK");

  conditionsStepSchema = z.object({
    existing_conditions: z.array(z.string()),
  });
  console.log("[signup-validation] conditionsStepSchema created OK");

  signupSchema = phoneStepSchema
    .merge(infoStepSchema)
    .merge(conditionsStepSchema);
  console.log("[signup-validation] signupSchema merged OK");
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[signup-validation] CRASH during schema creation:", msg);
  // Fallback — schemas that accept anything to avoid crashing the app
  const fallback = z.object({});
  phoneStepSchema = fallback;
  infoStepSchema = fallback;
  conditionsStepSchema = fallback;
  signupSchema = fallback;
}

console.log("[signup-validation] Module init complete");

export { phoneStepSchema, infoStepSchema, conditionsStepSchema, signupSchema };
export type SignupData = z.infer<typeof signupSchema>;
