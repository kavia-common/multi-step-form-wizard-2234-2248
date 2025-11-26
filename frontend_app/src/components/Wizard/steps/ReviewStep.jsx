import React from "react";
import Button from "../../common/Button";

/**
 * PUBLIC_INTERFACE
 * ReviewStep
 * Displays a read-only summary of the collected values with per-section edit actions.
 *
 * Props:
 * - values: object (all collected fields)
 * - onEditSection?: function(stepIndex: number)
 * - consentChecked?: boolean - whether consent checkbox is checked
 * - onConsentChange?: function(checked: boolean) - handler to update consent state
 */
export default function ReviewStep({ values = {}, onEditSection, consentChecked = false, onConsentChange }) {
  // Helper: returns true if obj has a truthy, non-empty value
  const hasData = (obj) => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === "string") return v.trim().length > 0;
      if (typeof v === "boolean") return v === true;
      if (typeof v === "number") return !Number.isNaN(v);
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "object") return Object.keys(v).length > 0;
      return Boolean(v);
    });
  };

  const EditBtn = ({ stepIndex, label }) => (
    <Button
      variant="ghost"
      type="button"
      className="px-2 py-1 text-xs"
      onClick={() => onEditSection?.(stepIndex)}
      ariaLabel={`Edit ${label}`}
    >
      Edit
    </Button>
  );

  // Build section presence checks
  const accountSection = { username: values.username };
  const profileNameSection = { firstName: values.firstName, lastName: values.lastName };
  const profileEmailSection = { email: values.email };
  // Newsletter preferences
  const preferencesSection = {
    topics: Array.isArray(values.topics) ? values.topics : [],
    frequency: values.frequency,
    format: values.format,
    interests: values.interests,
  };

  const showAccount = hasData(accountSection);
  const showName = hasData(profileNameSection);
  const showEmail = hasData(profileEmailSection);
  const showPreferences = hasData(preferencesSection);

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Review your information before submitting.</p>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {showAccount && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Account</h3>
              <EditBtn stepIndex={0} label="Account" />
            </div>
            <p className="text-sm text-gray-600">Username: {values.username}</p>
          </div>
        )}

        {showName && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Name</h3>
              <EditBtn stepIndex={1} label="Profile" />
            </div>
            <p className="text-sm text-gray-600">
              {[values.firstName, values.lastName].filter(Boolean).join(" ")}
            </p>
          </div>
        )}

        {showEmail && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Email</h3>
              <EditBtn stepIndex={1} label="Profile" />
            </div>
            <p className="text-sm text-gray-600">{values.email}</p>
          </div>
        )}

        {showPreferences && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Newsletter Preferences</h3>
              <EditBtn stepIndex={2} label="Preferences" />
            </div>
            <div className="mt-1 text-sm text-gray-700 space-y-1">
              {Array.isArray(values.topics) && values.topics.length > 0 ? (
                <p>
                  Topics:{" "}
                  {values.topics
                    .map((t) => {
                      const map = {
                        product: "Product Updates",
                        promotions: "Promotions",
                        news: "News & Articles",
                        events: "Events",
                      };
                      return map[t] || t;
                    })
                    .join(", ")}
                </p>
              ) : null}
              {values.frequency ? (
                <p>
                  Frequency:{" "}
                  {values.frequency === "daily"
                    ? "Daily"
                    : values.frequency === "weekly"
                    ? "Weekly"
                    : values.frequency === "monthly"
                    ? "Monthly"
                    : values.frequency}
                </p>
              ) : null}
              {values.format ? (
                <p>Format: {values.format === "html" ? "HTML" : values.format === "text" ? "Plain Text" : values.format}</p>
              ) : null}
              {typeof values.interests === "string" && values.interests.trim() ? (
                <p className="whitespace-pre-wrap">Interests: {values.interests}</p>
              ) : null}
              {!Array.isArray(values.topics) && !values.frequency && !values.format && !values.interests ? (
                <p className="text-gray-500">No preferences provided.</p>
              ) : null}
            </div>
          </div>
        )}

        {/* Consent section */}
        <div
          className="mt-2 rounded-md border border-primary/20 bg-primary/5 p-3 ring-1 ring-black/5"
          role="group"
          aria-labelledby="consent-label"
        >
          <div className="flex items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/30"
              checked={Boolean(consentChecked)}
              onChange={(e) => onConsentChange?.(e.target.checked)}
              aria-describedby="consent-desc"
            />
            <div>
              <div id="consent-label" className="text-sm font-medium text-gray-800">
                Consent and final acknowledgement
              </div>
              <p id="consent-desc" className="mt-1 text-sm text-gray-700">
                I confirm that the information provided is accurate and I consent to processing it in accordance with the stated policy.
              </p>
              {!values.consent ? (
                <p className="mt-2 text-xs text-error" role="note">
                  You must check this box to enable final submission.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
