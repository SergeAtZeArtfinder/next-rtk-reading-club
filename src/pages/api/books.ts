// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

import type { Book } from "@/types"

import { getAllBooks } from "@/lib/db"

type Data = {
  data: Book[]
}

type ErrorData = {
  error: string
}

const getBooksHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>,
) => {
  try {
    const data = await getAllBooks()
    res.status(200).json({ data })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch books from database"
    res.status(500).json({ error: message })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>,
) {
  switch (req.method) {
    case "GET":
      return getBooksHandler(req, res)
    default:
      res.setHeader("Allow", ["GET"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
