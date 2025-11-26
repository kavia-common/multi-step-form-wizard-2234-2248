//
// PUBLIC_INTERFACE
// Ocean theme tokens for optional JS usage in components.
// Mirrors Tailwind theme extensions (see tailwind.config.js) so you can
// import JS constants when dynamic values are needed.
//
// Usage examples:
//   import { colors, gradients, classes } from '../theme/ocean';
//   <div className={classes.card}>...</div>
//   <button style={{ backgroundColor: colors.primary.DEFAULT }}>…</button>
//

// PUBLIC_INTERFACE
export const colors = {
  /** Primary brand blues */
  primary: {
    DEFAULT: "#2563EB",
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563EB",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  /** Secondary amber accent */
  secondary: {
    DEFAULT: "#F59E0B",
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#F59E0B",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
};

// PUBLIC_INTERFACE
export const gradients = {
  /** Matches backgroundImage.ocean-gradient in Tailwind config */
  ocean: "linear-gradient(to bottom right, rgba(59,130,246,0.1), #f9fafb)",
};

// PUBLIC_INTERFACE
export const classes = {
  // Utility class groups to keep styles consistent in JS-land
  buttonBase:
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  buttonPrimary: "bg-primary text-white hover:bg-primary-700 focus:ring-primary border border-transparent",
  buttonSecondary: "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary border border-transparent",
  buttonGhost: "bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary border border-gray-300",

  card: "rounded-xl bg-surface p-6 shadow-soft ring-1 ring-black/[0.03]",
  inputBase:
    "w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm outline-none transition ring-primary/20 focus:border-primary focus:ring-2",
  inputError: "border-error focus:ring-error/30",
  inputNormal: "border-gray-300",
};

// PUBLIC_INTERFACE
export default {
  colors,
  gradients,
  classes,
};
