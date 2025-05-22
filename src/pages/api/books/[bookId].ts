import { getServerSession } from "next-auth"

import type { NextApiRequest, NextApiResponse } from "next"
import type {
  Book,
  NextApiSuccessResponse,
  NextApiErrorResponse,
} from "@/types"

import { updateBook, deleteBook } from "@/lib/db/books"
import { schemaCreateBook as schemaUpdateBook } from "@/lib/validation"
import { authOptions } from "@/lib/auth"

const updateBookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<NextApiSuccessResponse<Book> | NextApiErrorResponse>,
) => {
  try {
    const validation = schemaUpdateBook.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map((e) => e.message).join(", "),
      })
    }
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        redirectPath: "/api/auth/signin",
      })
    }
    const { id: userId, role } = session.user
    const bookId = req.query.bookId as string

    const updatedBook = await updateBook({
      userId,
      bookId,
      input: {
        ...validation.data,
      },
      isAdmin: role === "ADMIN",
    })

    return res.status(200).json({
      success: true,
      data: updatedBook,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update book"
    res.status(500).json({ success: false, error: message })
  }
}

const deleteBookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<NextApiSuccessResponse<Book> | NextApiErrorResponse>,
) => {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        redirectPath: "/api/auth/signin",
      })
    }
    const { id: userId, role } = session.user
    const bookId = req.query.bookId as string
    const deletedBook = await deleteBook({
      userId,
      bookId,
      isAdmin: role === "ADMIN",
    })
    return res.status(200).json({
      success: true,
      data: deletedBook,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete book"
    res.status(500).json({ success: false, error: message })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NextApiSuccessResponse<Book> | NextApiErrorResponse>,
) {
  switch (req.method) {
    case "PUT":
      return updateBookHandler(req, res)
    case "DELETE":
      return deleteBookHandler(req, res)
    default:
      res.setHeader("Allow", ["PUT", "DELETE"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
