import { describe, it, expect } from "vitest";
import {
  cityStepSchema,
  basicInfoStepSchema,
  familyStepSchema,
  signupSchema,
} from "@/lib/validations/signup";

describe("cityStepSchema", () => {
  it("accepts a valid city", () => {
    expect(cityStepSchema.safeParse({ city: "Kampala" }).success).toBe(true);
  });

  it("rejects an empty city", () => {
    const result = cityStepSchema.safeParse({ city: "" });
    expect(result.success).toBe(false);
  });
});

describe("basicInfoStepSchema", () => {
  it("accepts valid basic info", () => {
    const result = basicInfoStepSchema.safeParse({
      sex: "female",
      age: 28,
      marital_status: "single",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid sex value", () => {
    const result = basicInfoStepSchema.safeParse({
      sex: "unknown",
      age: 28,
      marital_status: "single",
    });
    expect(result.success).toBe(false);
  });

  it("rejects age of 0", () => {
    const result = basicInfoStepSchema.safeParse({
      sex: "male",
      age: 0,
      marital_status: "married",
    });
    expect(result.success).toBe(false);
  });

  it("rejects age over 150", () => {
    const result = basicInfoStepSchema.safeParse({
      sex: "male",
      age: 200,
      marital_status: "married",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer age", () => {
    const result = basicInfoStepSchema.safeParse({
      sex: "male",
      age: 28.5,
      marital_status: "married",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid marital status", () => {
    const result = basicInfoStepSchema.safeParse({
      sex: "female",
      age: 30,
      marital_status: "complicated",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid marital statuses", () => {
    const statuses = ["single", "married", "divorced", "widowed", "other"];
    for (const status of statuses) {
      const result = basicInfoStepSchema.safeParse({
        sex: "male",
        age: 25,
        marital_status: status,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("familyStepSchema", () => {
  it("accepts true", () => {
    expect(familyStepSchema.safeParse({ has_family: true }).success).toBe(true);
  });

  it("accepts false", () => {
    expect(familyStepSchema.safeParse({ has_family: false }).success).toBe(true);
  });

  it("rejects null", () => {
    expect(familyStepSchema.safeParse({ has_family: null }).success).toBe(false);
  });
});

describe("signupSchema (full)", () => {
  it("accepts a complete valid signup payload", () => {
    const result = signupSchema.safeParse({
      city: "Mbarara",
      sex: "female",
      age: 32,
      marital_status: "married",
      has_family: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when city is missing", () => {
    const result = signupSchema.safeParse({
      sex: "male",
      age: 20,
      marital_status: "single",
      has_family: false,
    });
    expect(result.success).toBe(false);
  });
});
