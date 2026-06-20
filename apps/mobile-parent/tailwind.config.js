/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#F0F0F3", dark: "#212225" },
        "surface-selected": { DEFAULT: "#E0E1E6", dark: "#2E3135" },
        "text-secondary": { DEFAULT: "#60646C", dark: "#B0B4BA" },
      },
    },
  },
  plugins: [],
}
