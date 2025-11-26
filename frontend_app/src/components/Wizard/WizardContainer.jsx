import React from "react";
import ProgressBar from "./ProgressBar";
import { useWizard } from "../../hooks/useWizard";

/**
 * PUBLIC_INTERFACE
 * WizardContainer
 * Container component that manages a multi-step wizard.
 *
 * Props:
 * - steps: Array<{ id: string|number, title: string, Component?: React.FC, render?: (ctx) => ReactNode }>
 * - initialData: object - initial form data
 * - validators: Array<function> - per-step validators (data) => { valid: boolean, errors?: object }
 * - onSubmit: function - called on submit with (result: { valid, data, errors })
 *
 * Renders:
 * - Top ProgressBar
 * - Current step content (Component or render prop)
 * - Bottom navigation (Back/Next/Submit)
 */
export default function WizardContainer({
  steps = [],
  initialData = {},
  validators = [],
  onSubmit = () => {},
}) {
  const {
    currentStep,
    data,
    updateData,
    canGoBack,
    canGoNext,
    goTo,
    next,
    back,
    submit,
    progress,
    errors,
  } = useWizard({
    initialStep: 0,
    totalSteps: steps.length || 1,
    initialData,
    validators,
  });

  const active = steps[currentStep];

  const handleNext = () => {
    const res = next();
    if (!res.moved && res.reason === "invalid") {
      // eslint-disable-next-line no-console
      console.warn("Validation failed", errors);
    }
  };

  const handleSubmit = () => {
    const result = submit();
    onSubmit(result);
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="w-full border-b border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <ProgressBar
            current={currentStep}
            total={steps.length || 1}
            labels={steps.map((s) => s.title)}
            onStepClick={goTo}
          />
        </div>
      </header>

      <main className="mx-auto my-8 max-w-3xl px-4">
        <div className="rounded-xl bg-surface p-6 shadow-soft ring-1 ring-black/[0.03]">
          <h2 className="text-xl font-semibold text-gray-900">{active?.title || "Step"}</h2>
          <div className="mt-4">
            {active?.Component ? (
              <active.Component
                data={data}
                updateData={updateData}
                stepIndex={currentStep}
                progress={progress}
                errors={errors}
              />
            ) : typeof active?.render === "function" ? (
              active.render({ data, updateData, stepIndex: currentStep, progress, errors })
            ) : (
              <p className="text-sm text-gray-600">
                This is a placeholder for the step content. Provide a Component or render function for each step.
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 mt-12 w-full border-t border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={back}
              disabled={!canGoBack}
              aria-disabled={!canGoBack}
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              {canGoNext ? (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  onClick={handleSubmit}
                  title="Submit"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
