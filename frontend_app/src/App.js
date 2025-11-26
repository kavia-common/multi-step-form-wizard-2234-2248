import React from 'react';
import WizardContainer from './components/Wizard/WizardContainer';

/**
 * PUBLIC_INTERFACE
 * App - Multi-step Form Wizard Shell
 * Integrates the WizardContainer with placeholder steps and simple validators.
 */
function App() {
  // Placeholder step components
  const StepProfile = ({ data, updateData }) => (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Enter your basic profile information.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">First name</label>
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="Jane"
            aria-label="First name"
            value={data.firstName || ''}
            onChange={(e) => updateData({ firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Last name</label>
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="Doe"
            aria-label="Last name"
            value={data.lastName || ''}
            onChange={(e) => updateData({ lastName: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="jane.doe@example.com"
            aria-label="Email"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const StepDetails = ({ data, updateData }) => (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Provide some additional details.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">About you</label>
          <textarea
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="Tell us a bit about yourself..."
            rows={4}
            value={data.bio || ''}
            onChange={(e) => updateData({ bio: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="San Francisco"
            value={data.city || ''}
            onChange={(e) => updateData({ city: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-primary/20 focus:border-primary focus:ring-2"
            placeholder="United States"
            value={data.country || ''}
            onChange={(e) => updateData({ country: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const StepReview = ({ data }) => (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Review your information before submitting.</p>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Name</h3>
          <p className="text-sm text-gray-600">{data.firstName || '-'} {data.lastName || ''}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Email</h3>
          <p className="text-sm text-gray-600">{data.email || '-'}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">Location</h3>
          <p className="text-sm text-gray-600">{data.city || '-'}, {data.country || '-'}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <h3 className="text-sm font-medium text-gray-800">About</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.bio || '-'}</p>
        </div>
      </div>
    </div>
  );

  // PUBLIC_INTERFACE
  const steps = [
    { id: 1, title: 'Profile', Component: StepProfile },
    { id: 2, title: 'Details', Component: StepDetails },
    { id: 3, title: 'Review', Component: StepReview },
  ];

  // Simple validators for demo
  const validators = [
    (d) => {
      const errs = {};
      if (!d.firstName) errs.firstName = "First name is required";
      if (!d.lastName) errs.lastName = "Last name is required";
      if (!d.email || !/.+@.+\..+/.test(d.email)) errs.email = "Valid email is required";
      return { valid: Object.keys(errs).length === 0, errors: errs };
    },
    () => ({ valid: true }),
    () => ({ valid: true }),
  ];

  const handleSubmit = (result) => {
    // eslint-disable-next-line no-console
    console.log("Submit result:", result);
    if (result.valid) {
      alert("Submitted! Check console for data.");
    } else {
      alert("Fix errors before submitting.");
    }
  };

  return (
    <WizardContainer
      steps={steps}
      validators={validators}
      initialData={{}}
      onSubmit={handleSubmit}
    />
  );
}

export default App;
