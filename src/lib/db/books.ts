import type { Book } from "@/types"
import { prisma } from "."

export const getAllBooks = (): Promise<Book[]> => {
  return prisma.book.findMany().then((books) => {
    return books.map((book) => ({
      ...book,
      createdAt: book.createdAt.toString(),
      updatedAt: book.updatedAt.toString(),
    }))
  })
}
