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
        oldGold: "#D4AF37"
        zombie: "#E7D598",
        lightBlue: "#A7C7E7",
        matrix: "#B56562",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "var(--font-notoSansJp)"],
      },
      borderWidth: {
        "0.5": "0.5px",
      },
      boxShadow: {
        bottom: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      screens: {
        "max-sm": { max: "424px" },
      },
    },
  },
  plugins: [],
} satisfies Config;
