import React from "react";
import FormField from "../../common/FormField";

/**
 * PUBLIC_INTERFACE
 * ProfileStep
 * Collects basic profile information.
 *
 * Props:
 * - values: object with { firstName, lastName, email }
 * - errors: object with validation messages
 * - onChange: function({ fieldName: value })
 */
export default function ProfileStep({ values = {}, errors = {}, onChange }) {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600">Enter your basic profile information.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First name"
          required
          placeholder="Jane"
          value={values.firstName || ""}
          onChange={(e) => onChange?.({ firstName: e.target.value })}
          error={errors.firstName}
        />
        <FormField
          id="lastName"
          label="Last name"
          required
          placeholder="Doe"
          value={values.lastName || ""}
          onChange={(e) => onChange?.({ lastName: e.target.value })}
          error={errors.lastName}
        />
        <div className="sm:col-span-2">
          <FormField
            id="email"
            label="Email"
            required
            type="email"
            placeholder="jane.doe@example.com"
            value={values.email || ""}
            onChange={(e) => onChange?.({ email: e.target.value })}
            error={errors.email}
            helpText="We will never share your email."
          />
        </div>
      </div>
    </div>
  );
}
