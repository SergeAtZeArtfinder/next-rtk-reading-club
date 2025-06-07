import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // or 'happy-dom'
    setupFiles: "./vitest.setup.ts",
    include: ["**/*.test.{ts,tsx}"],
  },
})
