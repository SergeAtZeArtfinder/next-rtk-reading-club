import "@testing-library/jest-dom"
import { vi } from "vitest"

process.env.NEXT_PUBLIC_ART_BASE_URL = "https://arts-mock-api/v1"
process.env.NEXT_PUBLIC_ART_IMAGE_BASE_URL = "https://arts-mock-api/images"

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
