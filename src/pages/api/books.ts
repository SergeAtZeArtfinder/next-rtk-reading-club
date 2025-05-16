// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import type {
  Book,
  NextApiSuccessResponse,
  NextApiErrorResponse,
} from "@/types"

import { getAllBooks } from "@/lib/db"

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NextApiSuccessResponse<Book[]> | NextApiErrorResponse>,
) {
  switch (req.method) {
    case "GET":
      return getBooksHandler(req, res)
    default:
      res.setHeader("Allow", ["GET"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
