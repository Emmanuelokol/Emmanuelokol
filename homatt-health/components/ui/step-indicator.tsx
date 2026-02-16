"use client";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full transition-colors duration-200 ${
              i <= currentStep ? "bg-emerald-600" : "bg-gray-300"
            }`}
          />
          {i < totalSteps - 1 && (
            <div
              className={`h-0.5 w-6 transition-colors duration-200 ${
                i < currentStep ? "bg-emerald-600" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
