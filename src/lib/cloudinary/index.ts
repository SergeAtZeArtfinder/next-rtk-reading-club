import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"

import { CloudinaryImage } from "@/types"

import { fileSchema, filesSchema } from "@/lib/validation"
import {
  sortDeleteManyResults,
  getImagePublicId,
  getImagesMapById,
} from "./utils"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadMultipleImagesToCloudinary = async (
  files: File[],
): Promise<
  { data: CloudinaryImage[]; error: null } | { data: null; error: string }
> => {
  try {
    const validFiles = filesSchema.parse(files)
    if (!validFiles.length) throw new Error("No files found in form data")

    const uploadPromises = validFiles.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error || !result) {
              return reject(
                error || new Error(`Upload failed for: ${file.name}`),
              )
            }
            resolve(result)
          })
          .end(buffer)
      })
    })
    const results = await Promise.all(uploadPromises)
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

export const uploadSingleImageToCloudinary = async (
  file: File,
): Promise<
  { data: CloudinaryImage; error: null } | { data: null; error: string }
> => {
  const validFile = fileSchema.parse(file)

  if (!validFile) {
    return {
      data: null,
      error: "No valid file found in form data",
    }
  }

  try {
    const arrayBuffer = await validFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Upload failed"))
          }
          resolve(result)
        })
        .end(buffer)
    })

    return {
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

export const deleteCloudinaryImageByUrl = async (
  imageUrl: string,
): Promise<
  { data: { imageUrl: string }; error: null } | { data: null; error: string }
> => {
  try {
    if (!imageUrl.includes("res.cloudinary.com")) {
      throw new Error(`Image ${imageUrl} is not hosted on Cloudinary`)
    }
    const publicId = getImagePublicId(imageUrl)

    /**
     * Delete the image using the `public_id`
     */
    const res = await cloudinary.uploader.destroy(publicId)

    if (res.result === "not found") {
      throw new Error(`Image by publicId: ${publicId} not found`)
    }
    if (res.result !== "ok") {
      throw new Error(`Failed to delete image with publicId: ${publicId}`)
    }

    return {
      data: { imageUrl },
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
  imageUrls: string[],
): Promise<
  | { data: { deleted: string[]; notFound: string[] }; error: null }
  | { data: null; error: string }
> => {
  const cloudinaryUrls = imageUrls.filter((url) =>
    url.includes("res.cloudinary.com"),
  )

  try {
    if (!cloudinaryUrls.length) {
      throw new Error("No image URLs provided for deletion")
    }
    const imagesMap = getImagesMapById(cloudinaryUrls)

    const publicIds = Object.keys(imagesMap)
    /**
     * Use Cloudinary's API to delete multiple resources
     */
    const result = await cloudinary.api.delete_resources(publicIds)

    if (!result.deleted) {
      throw new Error("Failed to delete images")
    }

    return {
      data: sortDeleteManyResults(result.deleted, imagesMap),
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete images",
    }
  }
}
