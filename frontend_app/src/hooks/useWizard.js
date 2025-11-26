import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useWizard
 * React hook to manage multi-step wizard state: step index, form data, navigation, and validation.
 *
 * Params:
 * - options:
 *   - initialStep (number): starting step index (default 0)
 *   - totalSteps (number): number of steps (required)
 *   - initialData (object): initial form data map
 *   - validators (Array<function>): optional array of per-step validate functions: (data) => { valid: boolean, errors?: object }
 *
 * Returns:
 * - currentStep (number)
 * - setCurrentStep (function)
 * - data (object)
 * - updateData (function) => merges partials into data
 * - canGoBack (boolean)
 * - canGoNext (boolean)
 * - goTo (function) => jumps to specific step if valid bounds
 * - next (function) => validates current step (if validator) then advances
 * - back (function) => go to previous
 * - submit (function) => validates final step and returns { valid, data, errors }
 * - submitEnabled (boolean) => true only when all steps validate successfully
 * - progress (number 0..100)
 * - isEditing (boolean)
 * - editingFromStep (number | null)
 * - startEditing(stepIndex: number)
 * - saveAndReturnToReview(): { returned: boolean }
 * - cancelEditing(): void
 */
export function useWizard({
  initialStep = 0,
  totalSteps,
  initialData = {},
  validators = [],
}) {
  if (typeof totalSteps !== "number" || totalSteps <= 0) {
    // Soft guard; in production you could throw. Keeping console warning to avoid break in SSR/tests.
    // eslint-disable-next-line no-console
    console.warn("useWizard requires a positive totalSteps.");
  }

  const [currentStep, setCurrentStep] = useState(Math.min(Math.max(0, initialStep), Math.max(0, totalSteps - 1)));
  const [data, setData] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  // Track which steps have passed validation at least once (by index)
  const [completedSteps, setCompletedSteps] = useState({});
  // Submission UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingFromStep, setEditingFromStep] = useState(null); // the review step index to return to (usually last step)

  const progress = useMemo(() => {
    if (!totalSteps) return 0;
    return Math.min(100, Math.max(0, ((currentStep + 1) / totalSteps) * 100));
  }, [currentStep, totalSteps]);

  const updateData = useCallback((partial) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  /**
   * Run validator for a specific step index using current data.
   * Updates errors state with last run result for UX feedback.
   */
  const runValidator = useCallback(
    (index) => {
      const validator = validators?.[index];
      if (typeof validator === "function") {
        const result = validator(data);
        if (result && typeof result === "object") {
          const nextErrors = result.errors || {};
          setErrors(nextErrors);
          return { isValid: Boolean(result.valid), errors: nextErrors };
        }
        const isValid = Boolean(result);
        if (isValid) setErrors({});
        return { isValid, errors: isValid ? {} : {} };
      }
      // If no validator, consider valid
      setErrors({});
      return { isValid: true, errors: {} };
    },
    [validators, data]
  );

  /**
   * Purely check validation for a given step index without mutating visible errors.
   */
  const checkStepValid = useCallback(
    (index) => {
      const validator = validators?.[index];
      if (typeof validator !== "function") return true;
      const result = validator(data);
      return Boolean(result && result.valid !== false);
    },
    [validators, data]
  );

  /**
   * Check if all steps are valid. Non-function validators are treated as pass.
   * This does NOT mutate local errors state (pure check).
   */
  const allStepsValid = useCallback(() => {
    const count = validators?.length || totalSteps || 0;
    for (let i = 0; i < count; i++) {
      if (!checkStepValid(i)) return false;
    }
    return true;
  }, [validators, data, totalSteps, checkStepValid]);

  const canGoBack = currentStep > 0;
  const canGoNext = totalSteps ? currentStep < totalSteps - 1 : false;

  const goTo = useCallback(
    (index) => {
      if (typeof index !== "number") return;
      if (index < 0 || index > totalSteps - 1) return;
      setCurrentStep(index);
    },
    [totalSteps]
  );

  const next = useCallback(() => {
    if (!canGoNext) return { moved: false, reason: "end" };
    const { isValid, errors: latestErrors } = runValidator(currentStep);
    if (!isValid) return { moved: false, reason: "invalid", errors: latestErrors };
    // Mark current step as completed
    setCompletedSteps((prev) => ({ ...prev, [currentStep]: true }));
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    return { moved: true };
  }, [canGoNext, currentStep, runValidator, totalSteps]);

  const back = useCallback(() => {
    if (!canGoBack) return { moved: false, reason: "start" };
    setCurrentStep((s) => Math.max(0, s - 1));
    return { moved: true };
  }, [canGoBack]);

  // PUBLIC_INTERFACE
  const submit = useCallback(async () => {
    /** Validate final step and show an in-app acknowledgement; no backend calls are made. */
    setSubmitError(null);
    setSubmitSuccess(null);

    // Require all steps valid (includes consent validator from final step)
    if (!allStepsValid()) {
      const { errors: latestErrors } = runValidator(currentStep);
      return { valid: false, data, errors: latestErrors };
    }

    setIsSubmitting(true);
    try {
      // brief delay to provide UX feedback (spinner state)
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSubmitSuccess("Your information has been submitted successfully.");
      return { valid: true, data, errors: {} };
    } finally {
      setIsSubmitting(false);
    }
  }, [allStepsValid, currentStep, runValidator, data]);

  // PUBLIC_INTERFACE
  const startEditing = useCallback(
    (targetStepIndex, reviewStepIndex) => {
      /** Enable edit mode, remember the review step to return to, and jump to the target step. */
      if (typeof targetStepIndex !== "number") return;
      setIsEditing(true);
      setEditingFromStep(
        typeof reviewStepIndex === "number" ? reviewStepIndex : Math.max(0, (totalSteps || 1) - 1)
      );
      goTo(targetStepIndex);
    },
    [goTo, totalSteps]
  );

  // PUBLIC_INTERFACE
  const saveAndReturnToReview = useCallback(() => {
    /** Validate current step; if valid, return to the stored review step and exit edit mode. */
    const { isValid, errors: latestErrors } = runValidator(currentStep);
    if (!isValid) {
      return { returned: false, reason: "invalid", errors: latestErrors };
    }
    // Mark step as completed when saved successfully
    setCompletedSteps((prev) => ({ ...prev, [currentStep]: true }));
    const reviewIdx = typeof editingFromStep === "number" ? editingFromStep : Math.max(0, (totalSteps || 1) - 1);
    setIsEditing(false);
    setEditingFromStep(null);
    setCurrentStep(reviewIdx);
    return { returned: true };
  }, [currentStep, runValidator, editingFromStep, totalSteps]);

  // PUBLIC_INTERFACE
  const cancelEditing = useCallback(() => {
    /** Discard edit mode and return to review step without validation. */
    const reviewIdx = typeof editingFromStep === "number" ? editingFromStep : Math.max(0, (totalSteps || 1) - 1);
    setIsEditing(false);
    setEditingFromStep(null);
    setCurrentStep(reviewIdx);
  }, [editingFromStep, totalSteps]);

  // Keep completedSteps in sync with current data/validators
  useEffect(() => {
    const count = validators?.length || totalSteps || 0;
    if (!count) return;
    setCompletedSteps((prev) => {
      const next = { ...prev };
      for (let i = 0; i < count; i++) {
        if (checkStepValid(i)) {
          next[i] = true;
        } else {
          // Do not force false if previously completed? Requirement: show check only when validated.
          // If data became invalid, hide the check.
          next[i] = false;
        }
      }
      return next;
    });
  }, [data, validators, totalSteps, checkStepValid]);

  const submitEnabled = allStepsValid();

  return {
    currentStep,
    setCurrentStep,
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
    // Submission UI state
    isSubmitting,
    submitError,
    submitSuccess,
    // Edit mode API
    isEditing,
    editingFromStep,
    startEditing,
    saveAndReturnToReview,
    cancelEditing,
    // Global validation status
    submitEnabled,
    // Completed steps map for UI (e.g., ProgressBar)
    completedSteps,
  };
}
