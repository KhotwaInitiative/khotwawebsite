import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#800020",
          light: "#a31a3f",
          dark: "#5a0014",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "gradient-bg": "gradientBG 15s ease infinite",
        "float-1": "float1 4s ease-in-out infinite",
        "float-2": "float2 5s ease-in-out infinite 1s",
        "float-3": "float3 4.5s ease-in-out infinite 2s",
      },
      keyframes: {
        gradientBG: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float1: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        float3: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
