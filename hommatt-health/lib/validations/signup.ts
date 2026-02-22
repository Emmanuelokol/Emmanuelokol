import { z } from "zod";

/** Uganda phone: +256 followed by 9 digits */
const ugandaPhoneRegex = /^\+256[0-9]{9}$/;

export const phoneStepSchema = z.object({
  phone_number: z
    .string()
    .min(1, "Please enter your phone number")
    .regex(ugandaPhoneRegex, "Enter a valid Uganda number like +256 7XX XXX XXX"),
});

export const infoStepSchema = z.object({
  sex: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select one" }),
  }),
  city: z.string().min(1, "Please select your city"),
  dob: z.string().min(1, "Please select your date of birth"),
});

export const conditionsStepSchema = z.object({
  existing_conditions: z.array(z.string()),
});

export const signupSchema = phoneStepSchema
  .merge(infoStepSchema)
  .merge(conditionsStepSchema);

export type SignupData = z.infer<typeof signupSchema>;
