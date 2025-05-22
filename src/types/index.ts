export interface Book {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  genre: string
  author: string
  description: string
  images: string[]
  externalLink: string
}

export interface NextApiErrorResponse {
  success: false
  error: string
  redirectPath?: string
}

export interface NextApiSuccessResponse<T> {
  success: true
  data: T
}

export type CloudinaryImage = {
  publicId: string
  url: string
  width: number
  height: number
}
