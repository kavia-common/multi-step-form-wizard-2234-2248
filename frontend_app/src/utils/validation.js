//
// PUBLIC_INTERFACE
// Validation utilities: synchronous, composable field and step validators.
//
/**
 * PUBLIC_INTERFACE
 * required
 * Returns an error message if the value is empty (null, undefined, empty string after trim).
 */
export function required(message = "This field is required") {
  /** This is a public function. */
  return (value) => {
    const v = typeof value === "string" ? value.trim() : value;
    const empty = v === null || v === undefined || v === "" || (typeof v === "boolean" && v === false);
    return empty ? message : null;
  };
}

/**
 * PUBLIC_INTERFACE
 * email
 * Validates a simple email format using a light regex.
 */
export function email(message = "Please enter a valid email address") {
  /** This is a public function. */
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value) => {
    const v = (value || "").trim();
    if (!v) return null; // let required handle emptiness
    return re.test(v) ? null : message;
  };
}

/**
 * PUBLIC_INTERFACE
 * minLength
 * Ensures a string has at least `len` characters.
 */
export function minLength(len, message) {
  /** This is a public function. */
  const defaultMsg = `Must be at least ${len} characters`;
  return (value) => {
    const v = (value || "").toString();
    return v.length >= len ? null : message || defaultMsg;
  };
}

/**
 * PUBLIC_INTERFACE
 * matchesField
 * Compares against another field value from the full data object.
 */
export function matchesField(fieldName, message = "Values do not match") {
  /** This is a public function. */
  return (value, allValues = {}) => {
    return value === allValues[fieldName] ? null : message;
  };
}

/**
 * PUBLIC_INTERFACE
 * compose
 * Compose multiple validators for a single field. Returns the first error found.
 */
export function compose(...validators) {
  /** This is a public function. */
  return (value, allValues) => {
    for (const v of validators) {
      const err = v?.(value, allValues);
      if (err) return err;
    }
    return null;
  };
}

/**
 * PUBLIC_INTERFACE
 * validateFields
 * Run field-level validators given a schema of { fieldName: validatorFn }.
 * Returns { valid: boolean, errors: object }
 */
export function validateFields(values = {}, schema = {}) {
  /** This is a public function. */
  const errors = {};
  for (const [key, validator] of Object.entries(schema)) {
    if (typeof validator === "function") {
      const err = validator(values[key], values);
      if (err) errors[key] = err;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * PUBLIC_INTERFACE
 * makeStepValidator
 * Helper to generate a per-step validator function compatible with useWizard from a field schema.
 */
export function makeStepValidator(schema = {}) {
  /** This is a public function. */
  return (data = {}) => validateFields(data, schema);
}
