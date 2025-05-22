import { getServerSession } from "next-auth"

import type { NextApiRequest, NextApiResponse } from "next"
import type {
  NextApiErrorResponse,
  NextApiSuccessResponse,
  CloudinaryImage,
} from "@/types"

import { authOptions } from "@/lib/auth"

import {
  uploadMultipleImagesToCloudinary,
  deleteCloudinaryImageByUrl,
} from "@/lib/cloudinary"

const handleUploadManyImages = (
  req: NextApiRequest,
  res: NextApiResponse<
    NextApiErrorResponse | NextApiSuccessResponse<CloudinaryImage[]>
  >,
) => {
  const session = getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      redirectPath: "/api/auth/signin",
    })
  }

  const { files } = req.body
  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      success: false,
      error: "Invalid files",
    })
  }

  uploadMultipleImagesToCloudinary(files)
    .then((images) => {
      return res.status(200).json({ success: true, data: images.data || [] })
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : "Failed to upload images"
      return res.status(500).json({
        success: false,
        error: message,
      })
    })
}

const handleDeleteImage = (
  req: NextApiRequest,
  res: NextApiResponse<NextApiErrorResponse | NextApiSuccessResponse<string>>,
) => {
  const session = getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      redirectPath: "/api/auth/signin",
    })
  }

  const { publicId } = req.body
  if (!publicId) {
    return res.status(400).json({
      success: false,
      error: "Invalid publicId",
    })
  }

  deleteCloudinaryImageByUrl(publicId)
    .then(({ data }) => {
      return res.status(200).json({ success: true, data: data?.imageUrl || "" })
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete image"
      return res.status(500).json({
        success: false,
        error: message,
      })
    })
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
    case "DELETE":
      return handleDeleteImage(req, res)
    default:
      return res.status(405).end("Method Not Allowed")
  }
}

export default handleUploads
