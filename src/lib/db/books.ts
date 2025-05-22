import type { Book } from "@/types"
import type { Prisma } from "@prisma/client"

import { deleteMultipleImagesByUrls } from "@/lib/cloudinary"
import { formatBookDates } from "@/lib/utils"
import { prisma } from "."

export const getAllBooks = (): Promise<Book[]> => {
  return prisma.book.findMany().then((books) => {
    return books.map(formatBookDates)
  })
}

export const createNewBook = async (input: Prisma.BookCreateInput) => {
  const book = await prisma.book.create({
    data: { ...input },
  })
  return formatBookDates(book)
}

export const updateBook = async ({
  userId,
  bookId,
  input,
  isAdmin,
}: {
  userId: string
  bookId: string
  input: Prisma.BookUpdateInput
  isAdmin?: boolean
}) => {
  const existingBook = await prisma.book.findUnique({
    where: { id: bookId },
    select: { userId: true },
  })
  if (!existingBook) {
    throw new Error("Book not found")
  }
  if (existingBook.userId !== userId && !isAdmin) {
    throw new Error("Not authorized")
  }

  const updatedBook = await prisma.book.update({
    where: { id: bookId },
    data: { ...input },
  })

  return formatBookDates(updatedBook)
}

export const deleteBook = async ({
  userId,
  bookId,
  isAdmin,
}: {
  userId: string
  bookId: string
  isAdmin?: boolean
}) => {
  const existingBook = await prisma.book.findUnique({
    where: { id: bookId },
    select: { userId: true },
  })
  if (!existingBook) {
    throw new Error("Book not found")
  }
  if (existingBook.userId !== userId && !isAdmin) {
    throw new Error("Not authorized")
  }

  const deletedBook = await prisma.book.delete({
    where: { id: bookId },
  })

  const result = await deleteMultipleImagesByUrls(deletedBook.images)
  if (result.error) {
    // we don't want to throw here because we want to delete the book
    // normally this could be a background job
    console.log(`Failed to delete images: ${result.error}`)
  }

  return formatBookDates(deletedBook)
}
