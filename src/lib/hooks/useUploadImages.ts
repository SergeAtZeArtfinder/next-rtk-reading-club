import { useTransition } from "react"
import { addToast } from "@heroui/react"

import type {
  CloudinaryImage,
  NextApiErrorResponse,
  NextApiSuccessResponse,
} from "@/types"

import { getImagePublicId } from "@/lib/cloudinary/utils"

const uploadManyToCloudinary = async (
  files: File[],
): Promise<
  NextApiSuccessResponse<CloudinaryImage[]> | NextApiErrorResponse
> => {
  try {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i])
    }
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        error:
          (data as NextApiErrorResponse).error || "Failed to upload images",
      }
    }
    if (!data.success) {
      return {
        success: false,
        error:
          (data as NextApiErrorResponse).error || "Failed to upload images",
        redirectPath: (data as NextApiErrorResponse).redirectPath,
      }
    }
    return {
      success: true,
      data: (data as NextApiSuccessResponse<CloudinaryImage[]>).data || [],
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload images"
    return {
      success: false,
      error: message,
    }
  }
}

const deleteOneFromCloudinary = async (
  src: string,
): Promise<
  | NextApiSuccessResponse<{
      publicId: string
    }>
  | NextApiErrorResponse
> => {
  const publicId = getImagePublicId(src)

  try {
    const res = await fetch(`/api/upload/${publicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      const errorRes = await res.json()
      return {
        success: false,
        error: errorRes.error || "Failed to delete image",
      }
    }

    const response = await res.json()

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Failed to delete image",
        redirectPath: response.redirectPath,
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete image"
    return {
      success: false,
      error: message,
    }
  }
}

export const useUploadedImages = () => {
  const [isUploading, startTransition] = useTransition()

  const handleUploadImage = ({
    files,
    onSuccess,
  }: {
    files: File[]
    onSuccess: (data: string[]) => void
    onError?: (error: string) => void
  }) => {
    startTransition(async () => {
      const res = await uploadManyToCloudinary(files)
      if (res.success && res.data) {
        onSuccess(res.data.map((image) => image.url))
      }

      addToast({
        color: res.success ? "default" : "danger",
        description: res.success ? "Image uploaded successfully" : res.error,
      })
    })
  }

  const handleDeleteImage = ({
    src,
    onSuccess,
  }: {
    src: string
    onSuccess: (publicId: string) => void
  }) => {
    startTransition(async () => {
      const res = await deleteOneFromCloudinary(src)

      if (res.success) {
        onSuccess(res.data.publicId)
      }
      addToast({
        color: res.success ? "default" : "danger",
        description: res.success ? "image deleted" : res.error,
      })
    })
  }

  return { isUploading, handleUploadImage, handleDeleteImage }
}
