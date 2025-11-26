import React from 'react';
import WizardContainer from './components/Wizard/WizardContainer';
import AccountStep from './components/Wizard/steps/AccountStep';
import ProfileStep from './components/Wizard/steps/ProfileStep';
import PreferencesStep from './components/Wizard/steps/PreferencesStep';
import ReviewStep from './components/Wizard/steps/ReviewStep';
import { required, email, minLength, matchesField, compose, makeStepValidator } from './utils/validation';

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
    { id: 4, title: 'Review', Component: ({ data, onEditSection }) => <ReviewStep values={data} onEditSection={onEditSection} /> },
  ];

  // Validators for each step using shared utilities
  const validators = [
    // Account step
    makeStepValidator({
      username: compose(required('Username is required'), minLength(3, 'Username must be at least 3 characters')),
      password: compose(required('Password is required'), minLength(8, 'Password must be at least 8 characters')),
      confirmPassword: compose(required('Please confirm your password'), matchesField('password', 'Passwords do not match')),
    }),
    // Profile step
    makeStepValidator({
      firstName: required('First name is required'),
      lastName: required('Last name is required'),
      email: compose(required('Email is required'), email('Valid email is required')),
    }),
    // Preferences step (optional fields, keep valid by default)
    () => ({ valid: true, errors: {} }),
    // Review step
    () => ({ valid: true, errors: {} }),
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
