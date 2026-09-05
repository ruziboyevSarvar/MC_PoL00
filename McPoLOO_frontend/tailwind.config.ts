import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#F6F6F6",
        ink: "#171717",
        muted: "#6B6B6B",
        line: "#E9E9E9",
        brass: "#A8864B",
        graphite: "#30343A"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "Inter", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
