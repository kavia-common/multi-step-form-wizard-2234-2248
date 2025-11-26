import React from "react";
import ProgressBar from "./ProgressBar";
import { useWizard } from "../../hooks/useWizard";
import Button from "../common/Button";

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
    isSubmitting,
    submitError,
    submitSuccess,
    // Edit mode
    isEditing,
    startEditing,
    saveAndReturnToReview,
    cancelEditing,
    // New: global validation status for enabling submit
    submitEnabled,
    // Completed steps map for progress UI
    completedSteps,
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
      console.warn("Validation failed", res.errors || errors);
    }
  };

  const handleSubmit = async () => {
    const result = await submit();
    onSubmit(result);
  };

  const isReviewStep = currentStep === Math.max(0, (steps.length || 1) - 1);

  // When ReviewStep renders, provide edit handler to jump into edit mode
  const renderActiveComponent = () => {
    if (active?.Component) {
      const extraProps =
        isReviewStep
          ? {
              onEditSection: (stepIndex) => startEditing(stepIndex, currentStep),
            }
          : {};
      return (
        <active.Component
          data={data}
          updateData={updateData}
          stepIndex={currentStep}
          progress={progress}
          errors={errors}
          {...extraProps}
        />
      );
    }
    if (typeof active?.render === "function") {
      return active.render({ data, updateData, stepIndex: currentStep, progress, errors });
    }
    return (
      <p className="text-sm text-gray-600">
        This is a placeholder for the step content. Provide a Component or render function for each step.
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="w-full border-b border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <ProgressBar
            current={currentStep}
            total={steps.length || 1}
            labels={steps.map((s) => s.title)}
            onStepClick={goTo}
            completedSteps={completedSteps}
          />
        </div>
      </header>

      <main className="mx-auto my-8 max-w-4xl px-4">
        {/* Success acknowledgement panel */}
        {submitSuccess ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-amber-50 p-4 text-sm text-gray-800 shadow-soft ring-1 ring-black/5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-[2px] h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-500/30 flex items-center justify-center">
                ✓
              </div>
              <div>
                <h3 className="text-base font-semibold text-emerald-700">Submission successful</h3>
                <p className="mt-1 text-gray-700">
                  {typeof submitSuccess === "string"
                    ? submitSuccess
                    : "Your information has been submitted successfully."}
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  You can safely continue browsing or start a new submission.
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button type="button" variant="primary" onClick={() => window.location.reload()}>
                    Start over
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      // Keep the acknowledgement visible but allow continuing to review
                      // no-op or custom close logic could be added here
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-xl bg-surface p-6 shadow-soft ring-1 ring-black/[0.03]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{active?.title || "Step"}</h2>
            {isEditing && !isReviewStep ? (
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary/20">
                Editing
              </span>
            ) : null}
          </div>
          <div className="mt-4">{renderActiveComponent()}</div>
        </div>
      </main>

      {/* Error toast/panel if needed */}
      {submitError ? (
        <div className="mx-auto max-w-3xl px-4">
          <div
            role="alert"
            className="mb-4 rounded-md border border-error/30 bg-red-50 px-3 py-2 text-sm text-error"
          >
            {typeof submitError === "string"
              ? submitError
              : "We couldn't reach the server to save your submission. Please try again later."}
          </div>
        </div>
      ) : null}

      <footer className="sticky bottom-0 mt-6 w-full border-t border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              type="button"
              onClick={back}
              disabled={!canGoBack}
              aria-disabled={!canGoBack}
            >
              Back
            </Button>
            <div className="flex items-center gap-2">
              {/* Edit mode save button when not on review */}
              {isEditing && !isReviewStep ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEditing}
                    title="Cancel editing and return to Review"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      const res = saveAndReturnToReview();
                      if (res.returned === false && res.reason === "invalid") {
                        // eslint-disable-next-line no-console
                        console.warn("Validation failed during save", res.errors || {});
                      }
                    }}
                    title="Save changes and return to Review"
                  >
                    Save changes
                  </Button>
                </>
              ) : canGoNext ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSubmit}
                  title={!submitEnabled ? "Complete all steps and consent to submit" : "Submit"}
                  disabled={isSubmitting || !submitEnabled}
                  aria-busy={isSubmitting || undefined}
                  aria-disabled={isSubmitting || !submitEnabled || undefined}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
