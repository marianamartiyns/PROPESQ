/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ufpb: {
          blue: "#003366",
          gold: "#FFD700",
          light: "#F5F5F5",
          dark: "#333333",
          accent: "#0050B3",
        },
      },
      boxShadow: {
        card: "0 6px 18px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      fontFamily: {
        sans: ["'Open Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
