import React from "react";
import oceanTheme from "../../theme/ocean";

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
  // Prefer Tailwind utility classes but provide JS theme fallbacks
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-700 focus:ring-primary border border-transparent" ||
      oceanTheme.classes.buttonPrimary,
    secondary:
      "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary border border-transparent" ||
      oceanTheme.classes.buttonSecondary,
    ghost:
      "bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary border border-gray-300" ||
      oceanTheme.classes.buttonGhost,
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
