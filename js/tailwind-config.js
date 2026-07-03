// Tailwind Play CDN configuration.
// Extends Tailwind's default theme with Grupo Uniclima's design tokens so
// utility classes like `bg-navy-950`, `text-blue-500` or `shadow-soft` are
// available anywhere in the markup, matching the values already used by
// assets/css/styles.css (kept in sync with the :root custom properties there).
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060f22",
          900: "#0a1a3a",
          800: "#0f2c5c",
        },
        blue: {
          700: "#164f9e",
          600: "#1c62c9",
          500: "#2d7dd2",
          400: "#4f9cf0",
          300: "#7fb3f0",
        },
        ice: {
          100: "#eef4fc",
        },
        slate: {
          600: "#5b6b85",
          300: "#c7d2e3",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(10, 26, 58, 0.35)",
      },
      borderRadius: {
        brand: "28px",
      },
      maxWidth: {
        container: "1180px",
      },
    },
  },
};
