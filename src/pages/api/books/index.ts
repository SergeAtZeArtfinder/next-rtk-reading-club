// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getServerSession } from "next-auth"

import type { NextApiRequest, NextApiResponse } from "next"
import type {
  Book,
  NextApiSuccessResponse,
  NextApiErrorResponse,
} from "@/types"

import { getAllBooks, createNewBook } from "@/lib/db"
import { schemaCreateBook } from "@/lib/validation"
import { authOptions } from "@/lib/auth"

const getBooksHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<NextApiSuccessResponse<Book[]> | NextApiErrorResponse>,
) => {
  try {
    const data = await getAllBooks()
    res.status(200).json({ success: true, data })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch books from database"
    res.status(500).json({ success: false, error: message })
  }
}

const createBookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<NextApiSuccessResponse<Book> | NextApiErrorResponse>,
) => {
  try {
    const validation = schemaCreateBook.safeParse(req.body)
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
    const { title, genre, author, description, externalLink, images } =
      validation.data
    const { id: userId } = session.user

    const newBook = await createNewBook({
      title,
      genre,
      author,
      description,
      externalLink,
      images,
      user: {
        connect: {
          id: userId,
        },
      },
    })

    return res.status(201).json({
      success: true,
      data: newBook,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create new book"
    return res.status(500).json({ success: false, error: message })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    NextApiSuccessResponse<Book[] | Book> | NextApiErrorResponse
  >,
) {
  switch (req.method) {
    case "GET":
      return getBooksHandler(req, res)
    case "POST":
      return createBookHandler(req, res)
    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
