import React from "react";

/**
 * PUBLIC_INTERFACE
 * ProgressBar
 * Ocean Professional segmented progress stepper styled to match the reference.
 *
 * Props:
 * - current (number): current step index (0-based)
 * - total (number): total number of steps
 * - labels (string[]): optional titles for steps to show alongside indicators
 * - onStepClick? (function): optional handler to jump to a given step index
 */
export default function ProgressBar({ current = 0, total = 1, labels = [], onStepClick }) {
  const clampedTotal = Math.max(1, Number(total) || 1);
  const clampedCurrent = Math.min(Math.max(0, Number(current) || 0), clampedTotal - 1);
  const stepsArray = Array.from({ length: clampedTotal });

  // ARIA progress as percentage across discrete steps
  const now = Math.round(((clampedCurrent + 1) / clampedTotal) * 100);

  return (
    <div aria-label="Wizard progress" className="w-full">
      {/* Header with status chip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-8 w-8 rounded-lg bg-primary/10 ring-1 ring-primary/20"
          />
          <div>
            <h1 className="text-lg font-semibold text-text">Setup Wizard</h1>
            <p className="text-sm text-gray-600">Follow the steps to complete your setup.</p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
          Step {clampedCurrent + 1} of {clampedTotal}
        </span>
      </div>

      {/* Main segmented stepper bar */}
      <div
        className="mt-4"
        role="progressbar"
        aria-label="Progress through steps"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={now}
      >
        <div
          className="
            relative w-full overflow-x-auto
            rounded-full
            bg-gradient-to-r from-blue-500/10 to-gray-50
            p-2
            ring-1 ring-black/5
          "
        >
          {/* Inner track with pill segments and connectors */}
          <div className="flex min-w-[28rem] items-center gap-3">
            {stepsArray.map((_, idx) => {
              const isComplete = idx < clampedCurrent;
              const isActive = idx === clampedCurrent;
              const isUpcoming = idx > clampedCurrent;

              const StepTag = typeof onStepClick === "function" ? "button" : "div";
              const clickProps =
                typeof onStepClick === "function"
                  ? { type: "button", onClick: () => onStepClick(idx) }
                  : {};

              // Colors and states
              const basePill =
                "relative flex items-center gap-2 rounded-full px-3 py-2 shadow-sm transition";
              const statePill = isComplete
                ? "bg-secondary text-white ring-1 ring-secondary/40 hover:shadow"
                : isActive
                ? "bg-white text-primary ring-1 ring-primary/30 hover:shadow"
                : "bg-white/80 text-gray-600 ring-1 ring-gray-200 hover:bg-white";

              const numberBase =
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition";
              const numberState = isComplete
                ? "bg-secondary text-white ring-1 ring-white/20"
                : isActive
                ? "bg-primary text-white ring-1 ring-primary/30"
                : "bg-white text-gray-700 ring-1 ring-gray-200";

              // Connector between steps (rounded pill-like)
              const Connector = () => (
                <div
                  aria-hidden="true"
                  className={`h-1.5 flex-1 rounded-full transition
                    ${isComplete ? "bg-primary" : isActive ? "bg-primary/60" : "bg-gray-200"}
                  `}
                />
              );

              return (
                <div key={idx} className="flex flex-1 items-center">
                  {/* Step pill */}
                  <StepTag
                    {...clickProps}
                    className={`${basePill} ${statePill} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={labels[idx] ?? `Step ${idx + 1}`}
                    title={labels[idx] ?? `Step ${idx + 1}`}
                  >
                    <span className={`${numberBase} ${numberState}`}>
                      {isComplete ? "✓" : idx + 1}
                    </span>
                    <span
                      className={`whitespace-nowrap text-xs sm:text-sm ${
                        isActive ? "font-medium" : "font-normal"
                      }`}
                    >
                      {labels[idx] ?? `Step ${idx + 1}`}
                    </span>
                  </StepTag>

                  {/* Connector except after last step */}
                  {idx < clampedTotal - 1 ? <Connector /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile hint: horizontally scrollable stepper; labels wrapped by default via whitespace utilities */}
      <p className="mt-2 hidden text-xs text-gray-500 sm:block">
        Tip: You can click a step to jump directly.
      </p>
    </div>
  );
}
