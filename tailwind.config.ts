import { heroui } from "@heroui/theme"
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        gallery: "repeat(auto-fit, minmax(250px,1fr))",
      },
      keyframes: {
        flameAnimation: {
          "0%, 100%": {
            opacity: "0",
            transform: "translate3d(0,0,0) scale(0.75) rotate(0)",
          },
          "25%": {
            opacity: "0.35",
            transform: "translate3d(0, -10%, 0) scale(1) rotate(-3deg)",
          },
          "50%": {
            opacity: "0.35",
            transform: "translate3d(0, -4%, 0) scale(1) rotate(3deg)",
          },
          "75%": {
            opacity: "0.35",
            transform: "translate3d(0, -20%, 0) scale(1) rotate(-3deg)",
          },
          "99%": {
            opacity: "0",
            transform: "translate3d(0, -50%, 0) scale(0.8) rotate(0)",
          },
        },
      },
      animation: {
        flame: "flameAnimation 2.5s ease-in infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
export default config
