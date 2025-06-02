import { getServerSession } from "next-auth"

import type { NextApiRequest, NextApiResponse } from "next"
import type { NextApiErrorResponse, NextApiSuccessResponse } from "@/types"

import { authOptions } from "@/lib/auth"

import { deleteCloudinaryImageByUrl } from "@/lib/cloudinary"

const handleDeleteImage = async (
  req: NextApiRequest,
  res: NextApiResponse<
    NextApiErrorResponse | NextApiSuccessResponse<{ publicId: string }>
  >,
) => {
  try {
    const session = getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        redirectPath: "/api/auth/signin",
      })
    }

    const { publicId } = req.query
    if (!publicId || typeof publicId !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid publicId",
      })
    }

    const response = await deleteCloudinaryImageByUrl(publicId)

    if (response.error) {
      return res.status(500).json({
        success: false,
        error: response.error,
      })
    } else {
      return res
        .status(200)
        .json({ success: true, data: { publicId: response.data!.publicId } })
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete image"
    return res.status(500).json({
      success: false,
      error: message,
    })
  }
}

export default handleDeleteImage
