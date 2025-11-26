import React from 'react';
import WizardContainer from './components/Wizard/WizardContainer';
import AccountStep from './components/Wizard/steps/AccountStep';
import ProfileStep from './components/Wizard/steps/ProfileStep';
import PreferencesStep from './components/Wizard/steps/PreferencesStep';
import ReviewStep from './components/Wizard/steps/ReviewStep';

/**
 * PUBLIC_INTERFACE
 * App - Multi-step Form Wizard Shell
 * Integrates the WizardContainer with the Ocean-themed steps and validators.
 */
function App() {
  // PUBLIC_INTERFACE
  const steps = [
    {
      id: 1,
      title: 'Account',
      Component: ({ data, updateData, errors }) => (
        <AccountStep
          values={{
            username: data.username,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }}
          errors={{
            username: errors.username,
            password: errors.password,
            confirmPassword: errors.confirmPassword,
          }}
          onChange={(patch) => updateData(patch)}
          onHelp={() =>
            alert(
              'Use at least 8 characters with a mix of letters, numbers, and symbols.'
            )
          }
        />
      ),
    },
    {
      id: 2,
      title: 'Profile',
      Component: ({ data, updateData, errors }) => (
        <ProfileStep
          values={{
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          }}
          errors={errors}
          onChange={(patch) => updateData(patch)}
        />
      ),
    },
    {
      id: 3,
      title: 'Preferences',
      Component: ({ data, updateData, errors }) => (
        <PreferencesStep
          values={{
            bio: data.bio,
            city: data.city,
            country: data.country,
            newsletter: data.newsletter,
          }}
          errors={errors}
          onChange={(patch) => updateData(patch)}
        />
      ),
    },
    { id: 4, title: 'Review', Component: ({ data }) => <ReviewStep values={data} /> },
  ];

  // Validators for each step
  const validators = [
    (d) => {
      const errs = {};
      if (!d.username || d.username.trim().length < 3)
        errs.username = 'Username must be at least 3 characters';
      if (!d.password || d.password.length < 8)
        errs.password = 'Password must be at least 8 characters';
      if (!d.confirmPassword) errs.confirmPassword = 'Please confirm your password';
      if (d.password && d.confirmPassword && d.password !== d.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
      return { valid: Object.keys(errs).length === 0, errors: errs };
    },
    (d) => {
      const errs = {};
      if (!d.firstName) errs.firstName = 'First name is required';
      if (!d.lastName) errs.lastName = 'Last name is required';
      if (!d.email || !/.+@.+\..+/.test(d.email)) errs.email = 'Valid email is required';
      return { valid: Object.keys(errs).length === 0, errors: errs };
    },
    () => ({ valid: true }),
    () => ({ valid: true }),
  ];

  const handleSubmit = (result) => {
    // eslint-disable-next-line no-console
    console.log('Submit result:', result);
    if (result.valid) {
      alert('Submitted! Check console for data.');
    } else {
      alert('Fix errors before submitting.');
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
