import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button
 * Reusable button component aligned with the Ocean theme.
 *
 * Props:
 * - variant: "primary" | "secondary" | "ghost" (default: "primary")
 * - type: "button" | "submit" | "reset" (default: "button")
 * - disabled: boolean
 * - className: string - additional classes to merge
 * - onClick: function
 * - ariaLabel: string - accessibility label if needed
 */
export default function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  onClick,
  ariaLabel,
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-700 focus:ring-primary border border-transparent",
    secondary:
      "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary border border-transparent",
    ghost:
      "bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary border border-gray-300",
  };

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
