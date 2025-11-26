import React from "react";

/**
 * PUBLIC_INTERFACE
 * ProgressBar
 * Accessible progress bar and step indicators for a multi-step wizard.
 * Props:
 * - current (number): current step index (0-based)
 * - total (number): total number of steps
 * - labels (string[]): optional titles for steps to show alongside indicators
 * - onStepClick? (function): optional handler to jump to a given step index
 */
export default function ProgressBar({ current = 0, total = 1, labels = [], onStepClick }) {
  const percentage = Math.min(100, Math.max(0, ((current + 1) / total) * 100));

  return (
    <div aria-label="Wizard progress" className="w-full">
      {/* Numeric status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-primary-700">Setup Wizard</h1>
          <p className="text-sm text-gray-600">Follow the steps to complete your setup.</p>
        </div>
        <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
          Step {current + 1} of {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full rounded-full bg-gray-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percentage)}>
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step indicators */}
      <ol className="mt-3 flex items-center justify-between text-xs text-gray-500">
        {Array.from({ length: total }).map((_, idx) => {
          const isActive = idx === current;
          const isComplete = idx < current;
          const label = labels[idx] ?? `Step ${idx + 1}`;
          const baseClasses = "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]";
          const stateClasses = isComplete
            ? "border-primary bg-primary text-white"
            : isActive
            ? "border-primary text-primary"
            : "border-gray-300 text-gray-500";

          return (
            <li key={idx} className="flex items-center gap-2">
              {typeof onStepClick === "function" ? (
                <button
                  type="button"
                  className={`${baseClasses} ${stateClasses}`}
                  aria-current={isActive ? "step" : undefined}
                  title={label}
                  onClick={() => onStepClick(idx)}
                >
                  {idx + 1}
                </button>
              ) : (
                <span
                  className={`${baseClasses} ${stateClasses}`}
                  aria-current={isActive ? "step" : undefined}
                  title={label}
                >
                  {idx + 1}
                </span>
              )}
              <span className={isActive ? "text-primary-700 font-medium" : ""}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
