"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/ui/step-indicator";
import { CityStep } from "./steps/city-step";
import { BasicInfoStep } from "./steps/basic-info-step";
import { FamilyStep } from "./steps/family-step";
import {
  cityStepSchema,
  basicInfoStepSchema,
  familyStepSchema,
} from "@/lib/validations/signup";
import { submitSignup } from "./actions";

const TOTAL_STEPS = 3;

interface FormErrors {
  city?: string;
  sex?: string;
  age?: string;
  marital_status?: string;
}

export function SignupForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form state — all steps share one flat object
  const [city, setCity] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [hasFamily, setHasFamily] = useState<boolean | null>(null);

  function validateCurrentStep(): boolean {
    setErrors({});

    if (step === 0) {
      const result = cityStepSchema.safeParse({ city });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({ city: fieldErrors.city?.[0] });
        return false;
      }
    }

    if (step === 1) {
      const result = basicInfoStepSchema.safeParse({
        sex,
        age: age === "" ? undefined : age,
        marital_status: maritalStatus,
      });
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          sex: fieldErrors.sex?.[0],
          age: fieldErrors.age?.[0],
          marital_status: fieldErrors.marital_status?.[0],
        });
        return false;
      }
    }

    if (step === 2) {
      const result = familyStepSchema.safeParse({
        has_family: hasFamily,
      });
      if (!result.success) {
        return false;
      }
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleFinish() {
    if (hasFamily === null) return;
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitSignup({
      city,
      sex: sex as "male" | "female",
      age: age as number,
      marital_status: maritalStatus as "single" | "married" | "divorced" | "widowed" | "other",
      has_family: hasFamily,
    });

    setSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
    } else {
      setSubmitSuccess(true);
    }
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-8 w-8 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          You're all set!
        </h2>
        <p className="text-sm text-gray-500">
          Welcome to Homatt Health. We're glad you're here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator totalSteps={TOTAL_STEPS} currentStep={step} />

      {step === 0 && (
        <CityStep value={city} onChange={setCity} error={errors.city} />
      )}

      {step === 1 && (
        <BasicInfoStep
          sex={sex}
          age={age}
          maritalStatus={maritalStatus}
          onSexChange={setSex}
          onAgeChange={setAge}
          onMaritalChange={setMaritalStatus}
          errors={errors}
        />
      )}

      {step === 2 && (
        <FamilyStep value={hasFamily} onChange={setHasFamily} />
      )}

      {submitError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-base font-medium text-gray-600 transition-colors active:bg-gray-50"
          >
            Back
          </button>
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="min-h-[48px] flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-base font-medium text-white transition-colors active:bg-emerald-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={submitting || hasFamily === null}
            className="min-h-[48px] flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-base font-medium text-white transition-colors active:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}
