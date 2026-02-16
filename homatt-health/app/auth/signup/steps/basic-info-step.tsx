"use client";

import { SelectCard } from "@/components/ui/select-card";

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

const MARITAL_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "other", label: "Other" },
] as const;

interface BasicInfoStepProps {
  sex: string;
  age: number | "";
  maritalStatus: string;
  onSexChange: (sex: string) => void;
  onAgeChange: (age: number | "") => void;
  onMaritalChange: (status: string) => void;
  errors?: {
    sex?: string;
    age?: string;
    marital_status?: string;
  };
}

export function BasicInfoStep({
  sex,
  age,
  maritalStatus,
  onSexChange,
  onAgeChange,
  onMaritalChange,
  errors,
}: BasicInfoStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Tell us a little about yourself
      </h2>

      {/* Sex */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-600">Sex</legend>
        <div className="grid grid-cols-2 gap-3">
          {SEX_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.value}
              label={opt.label}
              selected={sex === opt.value}
              onSelect={() => onSexChange(opt.value)}
            />
          ))}
        </div>
        {errors?.sex && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.sex}
          </p>
        )}
      </fieldset>

      {/* Age */}
      <div>
        <label
          htmlFor="age-input"
          className="mb-2 block text-sm font-medium text-gray-600"
        >
          Age
        </label>
        <input
          id="age-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={150}
          placeholder="e.g. 28"
          value={age}
          onChange={(e) => {
            const val = e.target.value;
            onAgeChange(val === "" ? "" : parseInt(val, 10));
          }}
          className="min-h-[48px] w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        />
        {errors?.age && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.age}
          </p>
        )}
      </div>

      {/* Marital Status */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-600">
          Marital Status
        </legend>
        <div className="flex flex-col gap-2">
          {MARITAL_OPTIONS.map((opt) => (
            <SelectCard
              key={opt.value}
              label={opt.label}
              selected={maritalStatus === opt.value}
              onSelect={() => onMaritalChange(opt.value)}
            />
          ))}
        </div>
        {errors?.marital_status && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.marital_status}
          </p>
        )}
      </fieldset>
    </div>
  );
}
