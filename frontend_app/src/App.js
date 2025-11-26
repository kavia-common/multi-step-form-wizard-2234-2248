import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    {
      id: 4,
      title: 'Review',
      Component: ({ data, updateData, onEditSection }) => (
        <ReviewStep
          values={data}
          onEditSection={onEditSection}
          consentChecked={Boolean(data.consent)}
          onConsentChange={(checked) => updateData({ consent: checked })}
        />
      ),
    },
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
    // Preferences step: require at least one meaningful value
    (data) => {
      const hasBio = typeof data.bio === 'string' && data.bio.trim().length > 0;
      const hasCity = typeof data.city === 'string' && data.city.trim().length > 0;
      const hasCountry = typeof data.country === 'string' && data.country.trim().length > 0;
      const wantsNewsletter = data.newsletter === true;

      const valid = hasBio || hasCity || hasCountry || wantsNewsletter;
      return { valid, errors: valid ? {} : { preferences: 'Please provide at least one preference (Bio, City, Country, or subscribe to Newsletter).' } };
    },
    // Review step: require consent to submit
    makeStepValidator({
      consent: (value) => (value ? null : 'You must consent before submitting'),
    }),
  ];

  const handleSubmit = (result) => {
    // eslint-disable-next-line no-console
    console.log('Submit result:', result);
    if (!result.valid) {
      alert('Please fix the highlighted errors and try again.');
      return;
    }
    // Navigate to acknowledgement page with a summary. No backend calls.
    navigate('/acknowledgement', { state: { formData: result.data } });
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
