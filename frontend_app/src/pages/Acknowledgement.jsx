import React, { useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/common/Button";

/**
 * PUBLIC_INTERFACE
 * Acknowledgement
 * Dedicated success page shown after a successful submit. Displays a summary and actions.
 *
 * Security: This component ensures sensitive fields are never displayed in clear text.
 * A safeDisplay() sanitizer masks/omits fields like passwords, tokens, and secrets.
 *
 * Props:
 * - locationState?: object - optional state passed through navigation to show a summary of data
 */

// PUBLIC_INTERFACE
function safeDisplay(input) {
  /**
   * Sanitizes a value for safe display by:
   * - Omitting or masking well-known sensitive keys
   * - Recursively sanitizing nested objects/arrays
   */
  const SENSITIVE_KEYS = new Set([
    "password",
    "confirmPassword",
    "token",
    "apiKey",
    "apikey",
    "api_key",
    "secret",
    "clientSecret",
    "client_secret",
    "ssn",
    "socialSecurityNumber",
    "creditCard",
    "cardNumber",
    "card_number",
    "cvv",
    "cvc",
    "pin",
    "accessToken",
    "refreshToken",
  ]);

  const mask = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.length <= 4) return "••••";
    // keep last 2 for hint
    return `${"•".repeat(Math.max(2, str.length - 2))}${str.slice(-2)}`;
  };

  const sanitize = (value, parentKey = "") => {
    if (Array.isArray(value)) {
      return value.map((v) => sanitize(v, parentKey));
    }
    if (value && typeof value === "object") {
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        // Check both exact key and patterns
        const keyLower = k.toLowerCase();
        const isSensitiveExact = SENSITIVE_KEYS.has(k) || SENSITIVE_KEYS.has(keyLower);
        const isSensitivePattern =
          keyLower.includes("password") ||
          keyLower.includes("secret") ||
          keyLower.includes("token") ||
          keyLower.includes("apikey") ||
          keyLower.includes("api_key") ||
          keyLower.includes("ssn") ||
          keyLower.includes("creditcard") ||
          keyLower.includes("cardnumber") ||
          keyLower === "cvv" ||
          keyLower === "cvc" ||
          keyLower === "pin";
        if (isSensitiveExact || isSensitivePattern) {
          // Mask instead of omit to keep field presence without leaking value
          out[k] = "••••••••";
        } else {
          out[k] = sanitize(v, k);
        }
      }
      return out;
    }
    // Primitive
    return value;
  };

  return sanitize(input);
}

export default function Acknowledgement() {
  // Manage focus for accessibility: focus the heading on mount
  const headingRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Retrieve navigation state for a potential summary (if provided by navigation)
  let rawSummary = {};
  // Prefer react-router location.state
  const locState = location?.state;
  if (locState && typeof locState === "object" && locState.formData) {
    rawSummary = locState.formData;
  } else {
    try {
      // Fallback: window.history.state?.usr is how react-router v6 stores state internally for direct access
      const routerState = window?.history?.state?.usr || {};
      if (routerState && typeof routerState === "object") rawSummary = routerState.formData || {};
    } catch {
      // swallow
    }
  }

  // Sanitize at the rendering layer to avoid showing secrets
  const summary = useMemo(() => safeDisplay(rawSummary), [rawSummary]);

  const hasSummary =
    summary &&
    typeof summary === "object" &&
    Object.keys(summary).some((k) => {
      const v = summary[k];
      if (v === null || v === undefined) return false;
      if (typeof v === "string") return v.trim().length > 0;
      if (typeof v === "boolean") return v === true;
      if (typeof v === "number") return !Number.isNaN(v);
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "object") return Object.keys(v).length > 0;
      return Boolean(v);
    });

  const downloadCopy = () => {
    try {
      // Download masked version as well
      const blob = new Blob([JSON.stringify(summary, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "submission.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // eslint-disable-next-line no-alert
      alert("Unable to download a copy at this time.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="w-full border-b border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="h-8 w-8 rounded-lg bg-primary/10 ring-1 ring-primary/20" />
              <div>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-lg font-semibold text-text focus:outline-none"
                >
                  Submission Acknowledgement
                </h1>
                <p className="text-sm text-gray-600">
                  Thank you for completing the wizard.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
              Completed
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto my-8 max-w-4xl px-4">
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-amber-50 p-4 text-sm text-gray-800 shadow-soft ring-1 ring-black/5"
        >
          <div className="flex items-start gap-3">
            <div className="mt-[2px] h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-500/30 flex items-center justify-center">
              ✓
            </div>
            <div>
              <h2 className="text-base font-semibold text-emerald-700">
                Submission successful
              </h2>
              <p className="mt-1 text-gray-700">
                Your information has been submitted successfully. A copy of the summary is shown below.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-6 shadow-soft ring-1 ring-black/[0.03]">
          <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
          {!hasSummary ? (
            <p className="mt-2 text-sm text-gray-600">
              No additional details were provided.
            </p>
          ) : (
            <div className="mt-4">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(summary).map(([key, value]) => (
                  <div key={key} className="rounded-md border border-gray-200 bg-white p-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {key}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-800 break-words">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2">
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                window.location.assign("/");
              }}
            >
              Return to start
            </Button>
            <Button variant="ghost" type="button" onClick={downloadCopy}>
              Download a copy
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
