import type { ArtworksQueryParams, ArtworkSummary } from "@/types"

const baseUrl = process.env.NEXT_PUBLIC_ART_BASE_URL
const imageBaseUrl = process.env.NEXT_PUBLIC_ART_IMAGE_BASE_URL

export const getArtEndpointUrl = ({
  page = 1,
  limit = 12,
  search,
}: ArtworksQueryParams) => {
  const pagination = page ? `&page=${page}&limit=${limit}` : ""
  const searchText = search ? `&q=${search}` : ""

  return `${baseUrl}/artworks${search ? "/search" : ""}?fields=id,title,classification_title,artist_display,date_display,short_description,main_reference_number,image_id${searchText}${pagination}`
}

export const getArtImageUrl = (imageId: string) => {
  return `${imageBaseUrl}/${imageId}/full/843,/0/default.jpg`
}

export const formatArtworksList = (data: ArtworkSummary[]) => {
  return data.map((artwork) => ({
    ...artwork,
    image_url: artwork.image_id ? getArtImageUrl(artwork.image_id) : null,
  }))
}
