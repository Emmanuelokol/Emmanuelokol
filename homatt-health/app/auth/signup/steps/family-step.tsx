"use client";

import { SelectCard } from "@/components/ui/select-card";

interface FamilyStepProps {
  value: boolean | null;
  onChange: (hasFamily: boolean) => void;
}

export function FamilyStep({ value, onChange }: FamilyStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Do you have a family you'd like to manage health for?
      </h2>
      <p className="text-sm text-gray-500">
        This helps us show you the right tools.
      </p>

      <div className="flex flex-col gap-3">
        <SelectCard
          label="Yes, I have a family"
          selected={value === true}
          onSelect={() => onChange(true)}
        />
        <SelectCard
          label="No, just me for now"
          selected={value === false}
          onSelect={() => onChange(false)}
        />
      </div>

      <p className="text-center text-xs text-gray-400">
        You can always change this later in Settings.
      </p>
    </div>
  );
}
