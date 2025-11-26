import React from "react";

/**
 * PUBLIC_INTERFACE
 * FormField
 * Accessible form field wrapper that renders a label, input or textarea, optional help text,
 * and error message. Applies Ocean theme styles and ARIA attributes.
 *
 * Props:
 * - id: string (required for proper label association)
 * - label: string | ReactNode (field label)
 * - helpText?: string | ReactNode
 * - error?: string | ReactNode
 * - required?: boolean
 * - type?: string (input type; ignored if as="textarea")
 * - as?: "input" | "textarea" (default: "input")
 * - value: string
 * - onChange: function
 * - placeholder?: string
 * - rows?: number (for textarea)
 * - className?: string additional classes for control
 * - labelClassName?: string additional classes for label
 * - containerClassName?: string classes for the wrapper
 * - inputProps?: object forwarded to the control
 */
export default function FormField({
  id,
  label,
  helpText,
  error,
  required = false,
  type = "text",
  as = "input",
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
  labelClassName = "",
  containerClassName = "",
  inputProps = {},
}) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const baseControl =
    "w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm outline-none transition ring-primary/20 focus:border-primary focus:ring-2";
  const controlClasses = [
    baseControl,
    error ? "border-error focus:ring-error/30" : "border-gray-300",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    "mb-1 block text-sm font-medium",
    error ? "text-error" : "text-gray-700",
    labelClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required ? <span className="ml-0.5 text-error" aria-hidden="true">*</span> : null}
        </label>
      )}

      {as === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          className={controlClasses}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={controlClasses}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
      )}

      {error ? (
        <p id={errorId} className="mt-1 text-xs text-error">
          {error}
        </p>
      ) : helpText ? (
        <p id={helpId} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
