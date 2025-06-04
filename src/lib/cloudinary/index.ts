import { v2 as cloudinary } from "cloudinary"

import type { CloudinaryImage } from "@/types"

import { parseForm } from "@/lib/parseFormData"
import { sortDeleteManyResults, getImagesMapById } from "./utils"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadMultipleImagesToCloudinary = async (
  files: Awaited<ReturnType<typeof parseForm>>,
): Promise<
  { data: CloudinaryImage[]; error: null } | { data: null; error: string }
> => {
  try {
    const results = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.filepath, {
          folder: "my_uploads",
        }),
      ),
    )
    const images: CloudinaryImage[] = results.map((result) => ({
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    }))

    return {
      data: images,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to upload images",
    }
  }
}

export const deleteCloudinaryImageByUrl = async (
  publicId: string,
): Promise<
  { data: { publicId: string }; error: null } | { data: null; error: string }
> => {
  try {
    /**
     * Delete the image using the `public_id`
     */
    const res = await cloudinary.uploader.destroy(`my_uploads/${publicId}`)

    if (res.result === "not found") {
      throw new Error(`Image by publicId: ${publicId} not found`)
    }
    if (res.result !== "ok") {
      throw new Error(`Failed to delete image with publicId: ${publicId}`)
    }

    return {
      data: { publicId },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete image",
    }
  }
}

export const deleteMultipleImagesByUrls = async (
  urls: string[],
): Promise<
  | { data: { deleted: string[]; notFound: string[] }; error: null }
  | { data: null; error: string }
> => {
  try {
    if (!urls.length) {
      return { data: { deleted: [], notFound: [] }, error: null }
    }

    const imagesMap = getImagesMapById(urls)
    const publicIds = Object.keys(imagesMap).map((id) => `my_uploads/${id}`)

    const response = await cloudinary.api.delete_resources(publicIds, {
      invalidate: true,
    })

    const result = sortDeleteManyResults(response, imagesMap)

    return {
      data: result,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete images",
    }
  }
}
