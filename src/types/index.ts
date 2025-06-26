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

export interface CloudinaryImage {
  publicId: string
  url: string
  width: number
  height: number
}

export interface ArtworkType {
  id: number
  title: string
  aat_id: string | null
}

export interface ArtworksQueryParams {
  page?: number
  limit?: number
  search?: string
  artworkType?: string
}

export interface ArtworkSummary {
  id: number
  title: string
  classification_title: string
  main_reference_number: string
  date_display: string
  artist_display: string
  short_description: string | null
  image_id: string
  image_url?: string | null
}

export interface ArtworksPagination {
  total: number
  limit: number
  offset: number
  total_pages: number
  current_page: number
  search?: string | null
  artworkType?: string | null
  prev_url?: string
  next_url?: string
}

export interface ArtsApiListResponse<D> {
  pagination: ArtworksPagination
  data: D[]
  info: Record<string, any>
  config: Record<string, any>
}

export type ArtsApiSearchResponse = ArtsApiListResponse<ArtworkSummary>
export type ArtworkTypesApiResponse = ArtsApiListResponse<ArtworkType>

export interface ArtworkDetails {
  id: number
  title: string
  alt_titles: string[] | null
  artist_display: string
  artist_title: string | null
  date_display: string // year
  place_of_origin: string | null
  description: string | null
  short_description: string | null
  dimensions: string | null
  medium_display: string | null
  publication_history: string | null
  exhibition_history: string | null
  provenance_text: string | null
  copyright_notice: string | null
  artwork_type_title: string | null
  image_id: string
  image_url: string
  alt_image_ids: string[] | null
  alt_image_urls: string[] | null
  source_updated_at: string | null
  classification_titles: string[] | null
  classification_title: string | null
}

export interface ArtworkDetailsApiResponse {
  data: ArtworkDetails
  info: Record<string, any>
  config: Record<string, any>
}
