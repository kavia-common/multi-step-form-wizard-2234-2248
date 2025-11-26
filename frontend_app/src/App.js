import React from 'react';

/**
 * PUBLIC_INTERFACE
 * App - Multi-step Form Wizard Shell
 * This component renders the overall shell for a multi-step form wizard:
 * - Top progress bar region
 * - Centered content card area
 * - Bottom navigation with Back/Next buttons
 *
 * It uses TailwindCSS classes aligned to the Ocean Professional theme configured in tailwind.config.js.
 * Placeholder content is provided so the app compiles. Replace placeholders with actual step components later.
 */
function App() {
  // PUBLIC_INTERFACE
  const steps = [
    { id: 1, title: 'Profile' },
    { id: 2, title: 'Details' },
    { id: 3, title: 'Review' },
  ];

  // PUBLIC_INTERFACE
  const currentStepIndex = 0; // Placeholder: integrate with state/logic later

  // Progress percentage calculation (placeholder)
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Top progress header */}
      <header className="w-full border-b border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-primary-700">Setup Wizard</h1>
              <p className="text-sm text-gray-600">Follow the steps to complete your setup.</p>
            </div>
            <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              role="progressbar"
            />
          </div>

          {/* Step indicators */}
          <ol className="mt-3 flex items-center justify-between text-xs text-gray-500">
            {steps.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isComplete = idx < currentStepIndex;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <span
                    className={[
                      'flex h-6 w-6 items-center justify-center rounded-full border text-[11px]',
                      isComplete
                        ? 'border-primary bg-primary text-white'
                        : isActive
                        ? 'border-primary text-primary'
                        : 'border-gray-300 text-gray-500',
                    ].join(' ')}
                    aria-current={isActive ? 'step' : undefined}
                    title={s.title}
                  >
                    {idx + 1}
                  </span>
                  <span className={isActive ? 'text-primary-700 font-medium' : ''}>{s.title}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {/* Center content card */}
      <main className="mx-auto my-8 max-w-3xl px-4">
        <div className="rounded-xl bg-surface p-6 shadow-soft ring-1 ring-black/[0.03]">
          <h2 className="text-xl font-semibold text-gray-900">Step Content Placeholder</h2>
          <p className="mt-2 text-sm text-gray-600">
            This is a placeholder for the step content. Replace this block with your step components and
            form fields. The layout centers the content in a card with subtle shadow and rounded corners.
          </p>

          {/* Minimal placeholder form controls */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">First name</label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                placeholder="Jane"
                aria-label="First name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Last name</label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                placeholder="Doe"
                aria-label="Last name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
                placeholder="jane.doe@example.com"
                aria-label="Email"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <footer className="sticky bottom-0 mt-12 w-full border-t border-gray-200 bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentStepIndex === 0}
              aria-disabled={currentStepIndex === 0}
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Next
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                title="Save draft"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
