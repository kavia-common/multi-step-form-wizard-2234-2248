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
  // Submission UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

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
    /** Validate final step and perform API or mock submission. */
    setSubmitError(null);
    setSubmitSuccess(null);

    const { isValid, errors: latestErrors } = runValidator(currentStep);
    if (!isValid) {
      return { valid: false, data, errors: latestErrors };
    }

    // If no API base configured, simulate async submit with success path
    const apiBase = process.env.REACT_APP_API_BASE;
    if (!apiBase) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSubmitSuccess("Your information has been submitted successfully.");
        return { valid: true, data, errors: {} };
      } finally {
        setIsSubmitting(false);
      }
    }

    // POST to `${REACT_APP_API_BASE}/submit`
    setIsSubmitting(true);
    try {
      const resp = await fetch(`${apiBase}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data || {}),
      });

      if (!resp.ok) {
        // Try to parse error message if available
        let message = `Submission failed with status ${resp.status}`;
        try {
          const j = await resp.json();
          if (j?.message) message = j.message;
        } catch {
          // ignore json parse errors
        }
        setSubmitError(message);
        return { valid: false, data, errors: { submit: message } };
      }

      // Success
      setSubmitSuccess("Your information has been submitted successfully.");
      return { valid: true, data, errors: {} };
    } catch (e) {
      const message = e?.message || "Network error during submission.";
      setSubmitError(message);
      return { valid: false, data, errors: { submit: message } };
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, runValidator, data]);

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
    // Submission UI state returned for consumers
    isSubmitting,
    submitError,
    submitSuccess,
  };
}
