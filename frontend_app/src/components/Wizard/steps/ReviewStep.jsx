import React from "react";

/**
 * PUBLIC_INTERFACE
 * ReviewStep
 * Displays a read-only summary of the collected values.
 *
 * Props:
 * - values: object (all collected fields)
 */
export default function ReviewStep({ values = {} }) {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Review your information before submitting.</p>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Account</h3>
          <p className="text-sm text-gray-600">Username: {values.username || "-"}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Name</h3>
          <p className="text-sm text-gray-600">
            {(values.firstName || "-") + " " + (values.lastName || "")}
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Email</h3>
          <p className="text-sm text-gray-600">{values.email || "-"}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Location</h3>
          <p className="text-sm text-gray-600">
            {(values.city || "-") + ", " + (values.country || "-")}
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">About</h3>
          <p className="whitespace-pre-wrap text-sm text-gray-600">{values.bio || "-"}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Preferences</h3>
          <p className="text-sm text-gray-600">
            Newsletter: {values.newsletter ? "Subscribed" : "Not subscribed"}
          </p>
        </div>
      </div>
    </div>
  );
}
