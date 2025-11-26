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
      {/* Ocean-themed header with gradient chip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-black/5"
          />
          <div>
            <h1 className="text-lg font-semibold text-primary-800">Setup Wizard</h1>
            <p className="text-sm text-gray-600">Follow the steps to complete your setup.</p>
          </div>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary/20">
          Step {current + 1} of {total}
        </span>
      </div>

      {/* Animated progress track */}
      <div
        className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-gray-100 to-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        aria-label="Progress through steps"
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-primary-500 to-primary-700 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* subtle shimmer on active area */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-[120px] -translate-x-full animate-[move_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ transform: `translateX(${percentage}%)` }}
          aria-hidden="true"
        />
      </div>

      {/* Step badges with labels */}
      <ol className="mt-4 grid grid-cols-12 items-start gap-2">
        {Array.from({ length: total }).map((_, idx) => {
          const isActive = idx === current;
          const isComplete = idx < current;
          const label = labels[idx] ?? `Step ${idx + 1}`;

          const badgeBase =
            "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition shadow-sm";
          const badgeState = isComplete
            ? "border-primary bg-primary text-white"
            : isActive
            ? "border-primary bg-white text-primary ring-2 ring-primary/20"
            : "border-gray-300 bg-white text-gray-500";
          const content = isComplete ? (
            <span aria-hidden="true">✓</span>
          ) : (
            <span aria-hidden="true">{idx + 1}</span>
          );

          const ItemTag = typeof onStepClick === "function" ? "button" : "div";
          const clickProps =
            typeof onStepClick === "function"
              ? {
                  type: "button",
                  onClick: () => onStepClick(idx),
                }
              : {};

          return (
            <li key={idx} className="col-span-12 sm:col-span-3">
              <ItemTag
                {...clickProps}
                className={`${badgeBase} ${badgeState} hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                aria-current={isActive ? "step" : undefined}
                aria-label={label}
                title={label}
              >
                {content}
              </ItemTag>
              <div className={`mt-1 text-xs ${isActive ? "text-primary-800 font-medium" : "text-gray-600"}`}>
                {label}
              </div>
            </li>
          );
        })}
      </ol>
      {/* Keyframes for shimmer */}
      <style>{`@keyframes move { 0% { transform: translateX(-120px); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}
