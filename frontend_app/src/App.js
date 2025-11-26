import React from 'react';
import WizardContainer from './components/Wizard/WizardContainer';
import FormField from './components/common/FormField';
import Button from './components/common/Button';

/**
 * PUBLIC_INTERFACE
 * App - Multi-step Form Wizard Shell
 * Integrates the WizardContainer with placeholder steps and simple validators.
 */
function App() {
  // Placeholder step components using common FormField and Button
  const StepProfile = ({ data, updateData, errors = {} }) => (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Enter your basic profile information.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First name"
          required
          placeholder="Jane"
          value={data.firstName || ''}
          onChange={(e) => updateData({ firstName: e.target.value })}
          error={errors.firstName}
        />
        <FormField
          id="lastName"
          label="Last name"
          required
          placeholder="Doe"
          value={data.lastName || ''}
          onChange={(e) => updateData({ lastName: e.target.value })}
          error={errors.lastName}
        />
        <div className="sm:col-span-2">
          <FormField
            id="email"
            label="Email"
            required
            type="email"
            placeholder="jane.doe@example.com"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            error={errors.email}
            helpText="We will never share your email."
          />
        </div>
      </div>
      <div className="mt-6">
        <Button variant="ghost" type="button">Need help?</Button>
      </div>
    </div>
  );

  const StepDetails = ({ data, updateData }) => (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Provide some additional details.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            id="bio"
            label="About you"
            as="textarea"
            rows={4}
            placeholder="Tell us a bit about yourself..."
            value={data.bio || ''}
            onChange={(e) => updateData({ bio: e.target.value })}
          />
        </div>
        <FormField
          id="city"
          label="City"
          placeholder="San Francisco"
          value={data.city || ''}
          onChange={(e) => updateData({ city: e.target.value })}
        />
        <FormField
          id="country"
          label="Country"
          placeholder="United States"
          value={data.country || ''}
          onChange={(e) => updateData({ country: e.target.value })}
        />
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
