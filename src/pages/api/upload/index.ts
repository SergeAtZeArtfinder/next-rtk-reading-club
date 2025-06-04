import { getServerSession } from "next-auth"

import type { NextApiRequest, NextApiResponse } from "next"
import type {
  NextApiErrorResponse,
  NextApiSuccessResponse,
  CloudinaryImage,
} from "@/types"

import { authOptions } from "@/lib/auth"
import { parseForm } from "@/lib/parseFormData"
import { uploadMultipleImagesToCloudinary } from "@/lib/cloudinary"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handleUploadManyImages = async (
  req: NextApiRequest,
  res: NextApiResponse<
    NextApiErrorResponse | NextApiSuccessResponse<CloudinaryImage[]>
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

    const files = await parseForm(req)

    const result = await uploadMultipleImagesToCloudinary(files)

    if (result.error) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    } else {
      const images = result.data
      return res.status(200).json({
        success: true,
        data: images || [],
      })
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload images"
    return res.status(500).json({
      success: false,
      error: message,
    })
  }
}

const handleUploads = (
  req: NextApiRequest,
  res: NextApiResponse<
    NextApiErrorResponse | NextApiSuccessResponse<CloudinaryImage[] | string>
  >,
) => {
  switch (req.method) {
    case "POST":
      return handleUploadManyImages(req, res)
    default:
      res.setHeader("Allow", ["POST"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handleUploads
