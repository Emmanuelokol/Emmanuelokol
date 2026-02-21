"use client";

interface SelectCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function SelectCard({ label, selected, onSelect }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`min-h-[48px] w-full rounded-xl border-2 px-4 py-3 text-left text-base font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        selected
          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
          : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
