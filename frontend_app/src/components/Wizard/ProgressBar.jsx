import React from "react";

/**
 * PUBLIC_INTERFACE
 * ProgressBar
 * Accessible progress bar and step indicators for a multi-step wizard with Ocean-themed visuals.
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
      {/* Ocean crest header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Crest with subtle wave */}
          <div
            aria-hidden="true"
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(245,158,11,0.18))",
            }}
          >
            <span className="absolute bottom-0 left-0 right-0 h-[55%] bg-primary/20 rounded-t-[40%]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary-800">Setup Wizard</h1>
            <p className="text-sm text-gray-600">Follow the steps to complete your setup.</p>
          </div>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary/20">
          Step {current + 1} of {total}
        </span>
      </div>

      {/* Ocean channel with animated bubbles and shimmer */}
      <div
        className="relative mt-4 h-3 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        aria-label="Progress through steps"
        style={{
          background:
            "linear-gradient(90deg, #eef2ff 0%, #e5e7eb 100%)",
        }}
      >
        {/* filled water */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background:
              "linear-gradient(90deg, #60a5fa 0%, #3b82f6 45%, #2563eb 100%)",
            boxShadow: "inset 0 0 6px rgba(255,255,255,0.25)",
          }}
        />
        {/* shimmer */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-[120px] -translate-x-full animate-[move_2.2s_linear_infinite]"
          style={{
            transform: `translateX(${percentage}%)`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden="true"
        />
        {/* bubbles */}
        <span
          className="pointer-events-none absolute h-2 w-2 -translate-y-1/2 animate-[rise_3.2s_linear_infinite] rounded-full bg-white/70"
          style={{ top: "50%", left: "12%" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute h-1.5 w-1.5 -translate-y-1/2 animate-[rise_2.6s_linear_infinite] rounded-full bg-white/60"
          style={{ top: "60%", left: "28%" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute h-1.5 w-1.5 -translate-y-1/2 animate-[rise_3.8s_linear_infinite] rounded-full bg-white/60"
          style={{ top: "40%", left: "66%" }}
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
            "flex h-8 w-8 items-center justify-center rounded-full border text-[11px] transition shadow-sm";
          const badgeState = isComplete
            ? "border-primary bg-primary text-white"
            : isActive
            ? "border-primary bg-white text-primary ring-2 ring-primary/30"
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
              <div
                className={`mt-1 text-xs ${
                  isActive ? "text-primary-800 font-medium" : "text-gray-600"
                }`}
              >
                {label}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Keyframes for shimmer and bubbles */}
      <style>{`
        @keyframes move { 0% { transform: translateX(-120px); } 100% { transform: translateX(100%); } }
        @keyframes rise { 0% { transform: translateY(6px); opacity: .75 } 100% { transform: translateY(-6px); opacity: .35 } }
      `}</style>
    </div>
  );
}
