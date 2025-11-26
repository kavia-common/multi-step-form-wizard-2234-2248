import React from "react";

/**
 * PUBLIC_INTERFACE
 * ProgressBar
 * Segmented progress bar with discrete steps using Ocean colors.
 * Props:
 * - current (number): current step index (0-based)
 * - total (number): total number of steps
 * - labels (string[]): optional titles for steps to show beneath indicators
 * - onStepClick? (function): optional handler to jump to a given step index
 */
export default function ProgressBar({ current = 0, total = 1, labels = [], onStepClick }) {
  const clampedTotal = Math.max(1, Number(total) || 1);
  const clampedCurrent = Math.min(Math.max(0, Number(current) || 0), clampedTotal - 1);

  // For ARIA progressbar (discrete steps -> translate to percentage)
  const now = Math.round(((clampedCurrent + 1) / clampedTotal) * 100);

  const stepsArray = Array.from({ length: clampedTotal });

  return (
    <div aria-label="Wizard progress" className="w-full">
      {/* Header: simple title and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-8 w-8 rounded-md bg-primary/15 ring-1 ring-primary/20"
          />
          <div>
            <h1 className="text-lg font-semibold text-primary-800">Setup Wizard</h1>
            <p className="text-sm text-gray-600">Follow the steps to complete your setup.</p>
          </div>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary/20">
          Step {clampedCurrent + 1} of {clampedTotal}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div
        className="mt-4"
        role="progressbar"
        aria-label="Progress through steps"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={now}
      >
        <div className="flex w-full gap-1.5">
          {stepsArray.map((_, idx) => {
            const isComplete = idx < clampedCurrent;
            const isActive = idx === clampedCurrent;

            // Base classes for segments
            const base =
              "h-2 flex-1 rounded-full transition-colors duration-200";

            // Visual state by step
            const state = isComplete
              ? "bg-primary"
              : isActive
              ? "bg-primary/70"
              : "bg-gray-200";

            const SegmentTag = typeof onStepClick === "function" ? "button" : "div";
            const clickProps =
              typeof onStepClick === "function"
                ? { type: "button", onClick: () => onStepClick(idx) }
                : {};

            return (
              <SegmentTag
                key={idx}
                {...clickProps}
                className={`${base} ${state} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                aria-current={isActive ? "step" : undefined}
                aria-label={labels[idx] ?? `Step ${idx + 1}`}
                title={labels[idx] ?? `Step ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Step indicators with numeric badges and labels */}
      <ol className="mt-3 grid grid-cols-12 items-start gap-2">
        {stepsArray.map((_, idx) => {
          const isActive = idx === clampedCurrent;
          const isComplete = idx < clampedCurrent;
          const label = labels[idx] ?? `Step ${idx + 1}`;

          const badgeBase =
            "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition";
          const badgeState = isComplete
            ? "border-primary bg-primary text-white"
            : isActive
            ? "border-primary bg-white text-primary ring-2 ring-primary/30"
            : "border-gray-300 bg-white text-gray-600";

          const content = isComplete ? (
            <span aria-hidden="true">✓</span>
          ) : (
            <span aria-hidden="true">{idx + 1}</span>
          );

          const ItemTag = typeof onStepClick === "function" ? "button" : "div";
          const clickProps =
            typeof onStepClick === "function"
              ? { type: "button", onClick: () => onStepClick(idx) }
              : {};

          // auto width on small screens, equal on sm+
          return (
            <li key={idx} className="col-span-12 sm:col-span-3">
              <ItemTag
                {...clickProps}
                className={`${badgeBase} ${badgeState} hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                aria-current={isActive ? "step" : undefined}
                aria-label={label}
                title={label}
              >
                {content}
              </ItemTag>
              <div
                className={`mt-1 line-clamp-1 text-xs ${
                  isActive ? "text-primary-800 font-medium" : "text-gray-600"
                }`}
              >
                {label}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
