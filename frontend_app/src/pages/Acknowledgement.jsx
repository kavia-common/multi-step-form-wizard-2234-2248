import React, { useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/common/Button";

/**
 * PUBLIC_INTERFACE
 * Acknowledgement
 * Dedicated success page shown after a successful submit. Displays a minimal, safe summary and actions.
 *
 * Security: This component ensures sensitive fields are never displayed in clear text.
 * We sanitize input and then explicitly pick only allowed fields for display.
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

  const sanitize = (value, parentKey = "") => {
    if (Array.isArray(value)) {
      return value.map((v) => sanitize(v, parentKey));
    }
    if (value && typeof value === "object") {
      const out = {};
      for (const [k, v] of Object.entries(value)) {
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
          // Omit sensitive fields completely from the sanitized object
          continue;
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

/**
 * PUBLIC_INTERFACE
 * formatTopics
 * Maps internal topic codes to human-friendly labels.
 */
function formatTopics(topics) {
  /** This is a public function. */
  if (!Array.isArray(topics)) return [];
  const map = {
    product: "Product Updates",
    promotions: "Promotions",
    news: "News & Articles",
    events: "Events",
  };
  return topics.map((t) => map[t] || t);
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
  const sanitized = useMemo(() => safeDisplay(rawSummary), [rawSummary]);

  // Explicitly pick allowed display fields only
  const allowed = useMemo(() => {
    const username = sanitized?.username || "";
    const firstName = sanitized?.firstName || "";
    const lastName = sanitized?.lastName || "";
    const topics = Array.isArray(sanitized?.topics) ? sanitized.topics.filter(Boolean) : [];

    return {
      username,
      fullName: [firstName, lastName].filter(Boolean).join(" "),
      topics: topics,
    };
  }, [sanitized]);

  const humanTopics = formatTopics(allowed.topics);
  const noTopicsSelected = !Array.isArray(allowed.topics) || allowed.topics.length === 0;

  const downloadCopy = () => {
    try {
      // Download only the allowed, sanitized version
      const blob = new Blob([JSON.stringify(allowed, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "acknowledgement.json";
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
      {/* Header: increase hierarchical clarity and spacing */}
      <header className="w-full border-b border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="h-10 w-10 rounded-lg bg-primary/10 ring-1 ring-primary/20"
              />
              <div>
                {/* h1 larger with improved tracking and line-height */}
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl sm:text-3xl font-semibold leading-snug tracking-tight text-text focus:outline-none"
                >
                  Submission Acknowledgement
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600 leading-relaxed tracking-wide">
                  Thanks for completing the setup. Here’s a brief summary.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
              Completed
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto my-10 max-w-3xl px-4">
        {/* Success announcement: slightly larger rhythm and subtle hierarchy */}
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-blue-50 p-5 text-sm sm:text-base text-gray-800 shadow-soft ring-1 ring-black/5"
        >
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25">
              ✓
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-emerald-700 leading-snug">
                Submission successful
              </h2>
              <p className="mt-1.5 text-gray-700 leading-relaxed">
                Your preferences were saved. Only key details are shown below for your records.
              </p>
            </div>
          </div>
        </div>

        {/* Summary card: increased spacing, clearer h2/h3, subtle shadow and radius */}
        <section className="rounded-2xl bg-surface p-7 shadow-soft ring-1 ring-black/[0.04]">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
            Summary
          </h2>

          {/* Increase vertical rhythm and readability */}
          <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Username
              </dt>
              <dd className="mt-1.5 break-words text-sm sm:text-base text-gray-900 leading-relaxed">
                {allowed.username || "—"}
              </dd>
            </div>

            <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Name
              </dt>
              <dd className="mt-1.5 break-words text-sm sm:text-base text-gray-900 leading-relaxed">
                {allowed.fullName || "—"}
              </dd>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Selected Newsletter Topics
              </dt>
              <dd className="mt-1.5 text-sm sm:text-base text-gray-900 leading-relaxed">
                {noTopicsSelected ? (
                  <span className="text-gray-500">No topics selected</span>
                ) : (
                  <ul className="mt-1.5 space-y-2">
                    {humanTopics.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-2 text-gray-900"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
                        />
                        <span className="leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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
              Download summary
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
