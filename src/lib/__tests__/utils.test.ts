import type { Book } from "@prisma/client"

import { formatBookDates } from "../utils"

describe("utils", () => {
  describe("formatBookDates", () => {
    const mockPrismaBook: Book = {
      id: "1",
      title: "Test Book",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
      genre: "Fiction",
      author: "John Doe",
      description: "A test book for unit testing.",
      images: ["cover.jpg"],
      externalLink: "https://example.com",
      userId: "user-123",
    }

    it("should format book dates correctly", () => {
      const formattedBook = formatBookDates(mockPrismaBook)

      expect(formattedBook).toEqual({
        ...mockPrismaBook,
        createdAt: mockPrismaBook.createdAt.toString(),
        updatedAt: mockPrismaBook.updatedAt.toString(),
      })
    })
  })
})
