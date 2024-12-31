import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F1E1",
        foreground: "var(--foreground)",
        appleBlossom: "#A54242",
        pineGlade: "#B8C68C",
        lightPineGlade: "rgba(184, 198, 140, 0.3)",
        amazon: "#2D6B47",
        denim: "#1876D2",
      },
      borderWidth: {
        "0.5": "0.5px",
      },
    },
  },
  plugins: [],
} satisfies Config;
