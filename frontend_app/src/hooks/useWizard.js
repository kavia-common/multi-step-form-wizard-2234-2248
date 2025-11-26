import { useCallback, useMemo, useState } from "react";

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
 * - progress (number 0..100)
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

  const progress = useMemo(() => {
    if (!totalSteps) return 0;
    return Math.min(100, Math.max(0, ((currentStep + 1) / totalSteps) * 100));
  }, [currentStep, totalSteps]);

  const updateData = useCallback((partial) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const runValidator = useCallback(
    (index) => {
      const validator = validators?.[index];
      if (typeof validator === "function") {
        const result = validator(data);
        if (result && typeof result === "object") {
          setErrors(result.errors || {});
          return Boolean(result.valid);
        }
        return Boolean(result);
      }
      // If no validator, consider valid
      setErrors({});
      return true;
    },
    [validators, data]
  );

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
    const valid = runValidator(currentStep);
    if (!valid) return { moved: false, reason: "invalid", errors };
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    return { moved: true };
  }, [canGoNext, currentStep, runValidator, errors, totalSteps]);

  const back = useCallback(() => {
    if (!canGoBack) return { moved: false, reason: "start" };
    setCurrentStep((s) => Math.max(0, s - 1));
    return { moved: true };
  }, [canGoBack]);

  const submit = useCallback(() => {
    // Validate final step if validator exists
    const valid = runValidator(currentStep);
    if (!valid) return { valid: false, data, errors };
    return { valid: true, data, errors: {} };
  }, [currentStep, runValidator, data, errors]);

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
  };
}
