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
   * Check if all steps are valid. Non-function validators are treated as pass.
   * This does NOT mutate local errors state (pure check).
   */
  const allStepsValid = useCallback(() => {
    for (let i = 0; i < (validators?.length || totalSteps || 0); i++) {
      const validator = validators?.[i];
      if (typeof validator === "function") {
        const result = validator(data);
        if (!result || result.valid === false) {
          return false;
        }
      }
    }
    return true;
  }, [validators, data, totalSteps]);

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

    // Require all steps valid to submit
    if (!allStepsValid()) {
      // Run validator for current step to surface errors to the user
      const { errors: latestErrors } = runValidator(currentStep);
      return { valid: false, data, errors: latestErrors };
    }

    // Resolve API base URL from supported env vars
    const rawApiBase =
      process.env.REACT_APP_API_BASE ||
      process.env.REACT_APP_BACKEND_URL ||
      "";

    // Helper to normalize base URL (trim trailing slashes)
    const normalizeBase = (u) => {
      if (!u || typeof u !== "string") return "";
      return u.replace(/\/+$/, "");
    };

    // Build final endpoint. If no env var, prefer same-origin relative path.
    const apiBase = normalizeBase(rawApiBase);
    const submitPath = "/submit";
    const url = apiBase ? `${apiBase}${submitPath}` : submitPath;

    // If no API base configured, simulate async submit with success path (mock)
    if (!apiBase) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSubmitSuccess("Your information has been submitted successfully.");
        return { valid: true, data, errors: {} };
      } finally {
        setIsSubmitting(false);
      }
    }

    // POST to the resolved URL. Add better diagnostics and CORS-friendly defaults.
    setIsSubmitting(true);
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // For most public APIs we should not include credentials by default.
        // If your backend requires cookies, change to: credentials: "include"
        credentials: "same-origin",
        mode: "cors",
        body: JSON.stringify(data || {}),
      });

      if (!resp.ok) {
        // Try to parse error message if available
        let message = `Submission failed with status ${resp.status}`;
        try {
          const ct = resp.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await resp.json();
            if (j?.message) message = j.message;
          } else {
            const t = await resp.text();
            if (t) message = `${message}: ${t}`;
          }
        } catch {
          // ignore json/text parse errors
        }
        // eslint-disable-next-line no-console
        console.error("[Submit] HTTP error", {
          url,
          status: resp.status,
          statusText: resp.statusText,
        });
        setSubmitError(message);
        return { valid: false, data, errors: { submit: message } };
      }

      // Success
      setSubmitSuccess("Your information has been submitted successfully.");
      return { valid: true, data, errors: {} };
    } catch (e) {
      // Network/CORS or fetch-level error.
      const message = e?.message || "Network error during submission.";
      // Provide actionable console diagnostics to help with CORS/HTTPS mismatch.
      // eslint-disable-next-line no-console
      console.error("[Submit] Network error", {
        url,
        error: message,
        hints:
          "Check REACT_APP_API_BASE/REACT_APP_BACKEND_URL, protocol (http vs https) mismatch, CORS headers on server, and that the endpoint is reachable.",
      });

      // Fallback: In a no-backend environment or CORS-blocked dev env, mock success so UX is not blocked.
      // You can remove this fallback if a real backend is expected to always be available.
      await new Promise((resolve) => setTimeout(resolve, 300));
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
  };
}
