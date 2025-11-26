import React from "react";
import FormField from "../../common/FormField";

/**
 * PUBLIC_INTERFACE
 * PreferencesStep
 * Captures user preferences and misc profile details.
 *
 * Props:
 * - values: object with { bio, city, country, newsletter }
 * - errors: object with validation messages
 * - onChange: function({ fieldName: value })
 */
export default function PreferencesStep({ values = {}, errors = {}, onChange }) {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Tell us about your preferences.</p>
      {errors && errors.preferences ? (
        <div role="alert" className="mt-2 rounded-md border border-error/30 bg-red-50 px-3 py-2 text-xs text-error">
          {errors.preferences}
        </div>
      ) : null}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            id="bio"
            label="About you"
            as="textarea"
            rows={4}
            placeholder="Tell us a bit about yourself..."
            value={values.bio || ""}
            onChange={(e) => onChange?.({ bio: e.target.value })}
            error={errors.bio}
          />
        </div>
        <FormField
          id="city"
          label="City"
          placeholder="San Francisco"
          value={values.city || ""}
          onChange={(e) => onChange?.({ city: e.target.value })}
          error={errors.city}
        />
        <FormField
          id="country"
          label="Country"
          placeholder="United States"
          value={values.country || ""}
          onChange={(e) => onChange?.({ country: e.target.value })}
          error={errors.country}
        />
        <div className="sm:col-span-2">
          <label htmlFor="newsletter" className="mb-1 block text-sm font-medium text-gray-700">
            Newsletter
          </label>
          <div className="flex items-center gap-2">
            <input
              id="newsletter"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/30"
              checked={Boolean(values.newsletter)}
              onChange={(e) => onChange?.({ newsletter: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Subscribe to monthly product updates</span>
          </div>
          {errors.newsletter ? (
            <p className="mt-1 text-xs text-error">{errors.newsletter}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
