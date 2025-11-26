import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * PreferencesStep
 * Newsletter-specific preferences with accessible fieldsets and Ocean styling.
 *
 * Props:
 * - values: object with { topics: string[], frequency: string, format: string, interests: string }
 * - errors: object with validation messages
 * - onChange: function({ fieldName: value })
 */
export default function PreferencesStep({ values = {}, errors = {}, onChange }) {
  const options = useMemo(
    () => ({
      topics: [
        { id: "product-updates", label: "Product Updates", value: "product" },
        { id: "promotions", label: "Promotions", value: "promotions" },
        { id: "news-articles", label: "News & Articles", value: "news" },
        { id: "events", label: "Events", value: "events" },
      ],
      frequency: [
        { id: "freq-daily", label: "Daily", value: "daily" },
        { id: "freq-weekly", label: "Weekly", value: "weekly" },
        { id: "freq-monthly", label: "Monthly", value: "monthly" },
      ],
      format: [
        { id: "fmt-html", label: "HTML", value: "html" },
        { id: "fmt-text", label: "Plain Text", value: "text" },
      ],
    }),
    []
  );

  const selectedTopics = Array.isArray(values.topics) ? values.topics : [];

  const toggleTopic = (topicValue) => {
    const set = new Set(selectedTopics);
    if (set.has(topicValue)) set.delete(topicValue);
    else set.add(topicValue);
    onChange?.({ topics: Array.from(set) });
  };

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Choose your newsletter preferences.</p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        {/* Topics */}
        <fieldset
          className="rounded-lg border border-gray-200 bg-white p-4 ring-1 ring-black/5"
          aria-describedby={errors.topics ? "topics-error" : "topics-help"}
        >
          <legend className="px-1 text-sm font-semibold text-gray-800">Topics</legend>
          <p id="topics-help" className="mt-1 text-xs text-gray-500">
            Select one or more topics you’d like to hear about.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.topics.map((t) => (
              <label key={t.id} htmlFor={t.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">
                <input
                  id={t.id}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/30"
                  checked={selectedTopics.includes(t.value)}
                  onChange={() => toggleTopic(t.value)}
                  aria-invalid={Boolean(errors.topics) || undefined}
                  aria-describedby={errors.topics ? "topics-error" : undefined}
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
          {errors.topics ? (
            <p id="topics-error" className="mt-2 text-xs text-error">
              {errors.topics}
            </p>
          ) : null}
        </fieldset>

        {/* Frequency */}
        <fieldset
          className="rounded-lg border border-gray-200 bg-white p-4 ring-1 ring-black/5"
          aria-describedby={errors.frequency ? "frequency-error" : "frequency-help"}
        >
          <legend className="px-1 text-sm font-semibold text-gray-800">Delivery frequency</legend>
          <p id="frequency-help" className="mt-1 text-xs text-gray-500">
            How often would you like to receive emails?
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {options.frequency.map((f) => (
              <label key={f.id} htmlFor={f.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">
                <input
                  id={f.id}
                  type="radio"
                  name="frequency"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/30"
                  checked={values.frequency === f.value}
                  onChange={() => onChange?.({ frequency: f.value })}
                  aria-invalid={Boolean(errors.frequency) || undefined}
                  aria-describedby={errors.frequency ? "frequency-error" : undefined}
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
          {errors.frequency ? (
            <p id="frequency-error" className="mt-2 text-xs text-error">
              {errors.frequency}
            </p>
          ) : null}
        </fieldset>

        {/* Format */}
        <fieldset
          className="rounded-lg border border-gray-200 bg-white p-4 ring-1 ring-black/5"
          aria-describedby="format-help"
        >
          <legend className="px-1 text-sm font-semibold text-gray-800">Email format</legend>
          <p id="format-help" className="mt-1 text-xs text-gray-500">
            Choose how emails should be formatted. HTML includes images and rich content.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.format.map((fmt) => (
              <label key={fmt.id} htmlFor={fmt.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">
                <input
                  id={fmt.id}
                  type="radio"
                  name="format"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/30"
                  checked={values.format === fmt.value}
                  onChange={() => onChange?.({ format: fmt.value })}
                />
                <span>{fmt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Interests (optional) */}
        <div>
          <label htmlFor="interests" className="mb-1 block text-sm font-medium text-gray-700">
            Interests (optional)
          </label>
          <textarea
            id="interests"
            rows={4}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="Tell us more about your interests or topics you want covered..."
            value={values.interests || ""}
            onChange={(e) => onChange?.({ interests: e.target.value })}
          />
          {errors.interests ? (
            <p className="mt-1 text-xs text-error">{errors.interests}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              This helps us personalize recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
