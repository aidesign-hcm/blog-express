import type { Config } from "tailwindcss";

const config: Config = {
  mode: 'jit',
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      serif:
        'var(--libre-baskerville), ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
    extend: {
     
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require('daisyui')
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
export default config;
