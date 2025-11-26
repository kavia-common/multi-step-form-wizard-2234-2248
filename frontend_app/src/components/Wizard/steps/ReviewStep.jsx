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
 */
export default function ReviewStep({ values = {}, onEditSection }) {
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
  const locationSection = { city: values.city, country: values.country };
  const aboutSection = { bio: values.bio };
  const preferencesSection = { newsletter: values.newsletter };

  const showAccount = hasData(accountSection);
  const showName = hasData(profileNameSection);
  const showEmail = hasData(profileEmailSection);
  const showLocation = hasData(locationSection);
  const showAbout = hasData(aboutSection);
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

        {showLocation && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Location</h3>
              <EditBtn stepIndex={2} label="Preferences" />
            </div>
            <p className="text-sm text-gray-600">
              {[values.city, values.country].filter(Boolean).join(", ")}
            </p>
          </div>
        )}

        {showAbout && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">About</h3>
              <EditBtn stepIndex={2} label="Preferences" />
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-600">{values.bio}</p>
          </div>
        )}

        {showPreferences && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Preferences</h3>
              <EditBtn stepIndex={2} label="Preferences" />
            </div>
            <p className="text-sm text-gray-600">
              Newsletter: {values.newsletter ? "Subscribed" : "Not subscribed"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
