/** Tailwind configuration with Ocean Professional theme extension */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Ocean Professional palette from style guide
        primary: {
          DEFAULT: "#2563EB", // blue-600
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563EB",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        },
        secondary: {
          DEFAULT: "#F59E0B", // amber-500
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#F59E0B",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f"
        },
        success: "#F59E0B",
        error: "#EF4444",
        background: "#f9fafb",
        surface: "#ffffff",
        text: "#111827"
      },
      backgroundImage: {
        "ocean-gradient": "linear-gradient(to bottom right, rgba(59,130,246,0.1), #f9fafb)"
      },
      boxShadow: {
        soft: "0 4px 14px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        xl: "0.9rem"
      }
    }
  },
  plugins: []
};
