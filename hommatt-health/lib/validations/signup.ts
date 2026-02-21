import { z } from "zod";

export const cityStepSchema = z.object({
  city: z.string().min(1, "Please select your city or town"),
});

export const basicInfoStepSchema = z.object({
  sex: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select one" }),
  }),
  age: z
    .number({ invalid_type_error: "Please enter your age" })
    .int("Age must be a whole number")
    .min(1, "Please enter a valid age")
    .max(150, "Please enter a valid age"),
  marital_status: z.enum(["single", "married", "divorced", "widowed", "other"], {
    errorMap: () => ({ message: "Please select your status" }),
  }),
});

export const familyStepSchema = z.object({
  has_family: z.boolean(),
});

export const signupSchema = cityStepSchema
  .merge(basicInfoStepSchema)
  .merge(familyStepSchema);

export type SignupData = z.infer<typeof signupSchema>;
