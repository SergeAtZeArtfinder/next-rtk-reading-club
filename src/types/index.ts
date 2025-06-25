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
  userId: string
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

export type ArtworksQueryParams = {
  page?: number
  limit?: number
  search?: string
}

export type ArtworkSummary = {
  id: number
  title: string
  classification_title: string
  main_reference_number: string
  date_display: string
  artist_display: string
  short_description: null
  image_id: string
  image_url?: string | null
}

export type ArtworksPagination = {
  total: number
  limit: number
  offset: number
  total_pages: number
  current_page: number
  search?: string | null
  prev_url?: string
  next_url?: string
}

export type ArtsApiSearchResponse = {
  pagination: ArtworksPagination
  data: ArtworkSummary[]
  info: Record<string, any>
  config: Record<string, any>
}
