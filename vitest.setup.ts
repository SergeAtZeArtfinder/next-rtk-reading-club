import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Next.js useRouter globally
vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    replace: vi.fn(),
  }),
}))
