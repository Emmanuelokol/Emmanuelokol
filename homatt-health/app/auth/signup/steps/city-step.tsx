"use client";

import { SelectCard } from "@/components/ui/select-card";

const UGANDA_CITIES = [
  "Kampala",
  "Jinja",
  "Gulu",
  "Mbarara",
  "Lira",
  "Mbale",
  "Masaka",
  "Entebbe",
  "Fort Portal",
  "Soroti",
  "Arua",
  "Hoima",
];

interface CityStepProps {
  value: string;
  onChange: (city: string) => void;
  error?: string;
}

export function CityStep({ value, onChange, error }: CityStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Where do you live?
      </h2>
      <p className="text-sm text-gray-500">
        Pick the city or town closest to you.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {UGANDA_CITIES.map((city) => (
          <SelectCard
            key={city}
            label={city}
            selected={value === city}
            onSelect={() => onChange(city)}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
