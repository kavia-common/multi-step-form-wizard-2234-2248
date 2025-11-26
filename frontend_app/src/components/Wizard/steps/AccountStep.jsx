import React from "react";
import FormField from "../../common/FormField";
import Button from "../../common/Button";

/**
 * PUBLIC_INTERFACE
 * AccountStep
 * Captures account credentials with controlled inputs.
 *
 * Props:
 * - values: object containing { username, password, confirmPassword }
 * - errors: object with validation messages keyed by field
 * - onChange: function({ fieldName: value }) to update parent state
 * - onHelp?: optional click handler for contextual help
 */
export default function AccountStep({
  values = {},
  errors = {},
  onChange,
  onHelp,
}) {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600">
        Create your account credentials. Make sure to use a strong password.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="username"
          label="Username"
          required
          placeholder="ocean_user"
          value={values.username || ""}
          onChange={(e) => onChange?.({ username: e.target.value })}
          error={errors.username}
          containerClassName="sm:col-span-2"
          helpText="This will be your public identifier."
        />
        <FormField
          id="password"
          label="Password"
          required
          type="password"
          placeholder="••••••••"
          value={values.password || ""}
          onChange={(e) => onChange?.({ password: e.target.value })}
          error={errors.password}
        />
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          required
          type="password"
          placeholder="••••••••"
          value={values.confirmPassword || ""}
          onChange={(e) => onChange?.({ confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />
      </div>

      <div className="mt-6">
        <Button variant="ghost" type="button" onClick={onHelp}>
          Need help choosing a secure password?
        </Button>
      </div>
    </div>
  );
}
