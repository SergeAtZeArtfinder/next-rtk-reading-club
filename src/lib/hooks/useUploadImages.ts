import { useTransition } from "react"
import { addToast } from "@heroui/react"

import type {
  CloudinaryImage,
  NextApiErrorResponse,
  NextApiSuccessResponse,
} from "@/types"

const uploadManyToCloudinary = async (
  files: File[],
): Promise<
  NextApiSuccessResponse<CloudinaryImage[]> | NextApiErrorResponse
> => {
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify(files),
      headers: {
        "Content-Type": "application/json",
      },
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
      imageUrl: string
    }>
  | NextApiErrorResponse
> => {
  try {
    const res = await fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ publicId: src }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    if (!res.ok) {
      return {
        success: false,
        error: data.error || "Failed to delete image",
      }
    }
    if (!data.success) {
      return {
        success: false,
        error: data.error || "Failed to delete image",
        redirectPath: data.redirectPath,
      }
    }
    return {
      success: true,
      data: (
        data as NextApiSuccessResponse<{
          imageUrl: string
        }>
      ).data,
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
    onSuccess: (imageUrl: string) => void
  }) => {
    startTransition(async () => {
      const res = await deleteOneFromCloudinary(src)

      if (res.success && res.data) {
        onSuccess(res.data.imageUrl)
      }
      addToast({
        color: res.success ? "default" : "danger",
        description: res.success ? "image deleted" : res.error,
      })
    })
  }

  return { isUploading, handleUploadImage, handleDeleteImage }
}
