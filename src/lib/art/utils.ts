import type {
  ArtworksQueryParams,
  ArtworkSummary,
  ArtworkDetails,
} from "@/types"

const baseUrl = process.env.NEXT_PUBLIC_ART_BASE_URL
const imageBaseUrl = process.env.NEXT_PUBLIC_ART_IMAGE_BASE_URL
const artworkDetailsFields = [
  "id",
  "title",
  "alt_titles",
  "artist_display",
  "artist_title",
  "date_display",
  "place_of_origin",
  "description",
  "short_description",
  "dimensions",
  "medium_display",
  "publication_history",
  "exhibition_history",
  "provenance_text",
  "copyright_notice",
  "artwork_type_title",
  "artwork_type_id",
  "image_id",
  "alt_image_ids",
  "source_updated_at",
  "classification_titles",
  "classification_title",
]
const artworkSummaryFields = [
  "id",
  "title",
  "classification_title",
  "artwork_type_title",
  "artwork_type_id",
  "artist_display",
  "date_display",
  "short_description",
  "main_reference_number",
  "image_id",
]

export const getArtsListEndpointUrl = ({
  page = 1,
  limit = 12,
  search,
  artworkType,
}: ArtworksQueryParams) => {
  const pagination = page ? `&page=${page}&limit=${limit}` : ""
  const searchText = search ? `&q=${encodeURIComponent(search)}` : ""
  const fieldQuery = artworkType
    ? `&query[term][artwork_type_id]=${artworkType}`
    : ""
  return `${baseUrl}/artworks${search || artworkType ? "/search" : ""}?fields=${artworkSummaryFields.join(",")}${pagination}${searchText}${fieldQuery}`
}

export const getArtworkDetailsEndpointUrl = (artworkId: string) => {
  return `${baseUrl}/artworks/${artworkId}?fields=${artworkDetailsFields.join(",")}`
}

export const getArtImageUrl = (imageId: string) => {
  return `${imageBaseUrl}/${imageId}/full/843,/0/default.jpg`
}

export const getArtworkTypesUrl = (limit = 44) => {
  return `https://api.artic.edu/api/v1/artwork-types?limit=${limit}&fields=id,title,aat_id`
}

export const formatArtworksList = (data: ArtworkSummary[]) => {
  return data.map((artwork) => ({
    ...artwork,
    image_url: artwork.image_id ? getArtImageUrl(artwork.image_id) : null,
  }))
}

export const formatArtworkDetails = ({
  image_id,
  alt_image_ids,
  ...rest
}: ArtworkDetails): ArtworkDetails => {
  return {
    ...rest,
    image_id,
    alt_image_ids,
    image_url: getArtImageUrl(image_id),
    alt_image_urls: alt_image_ids
      ? alt_image_ids?.map((id) => getArtImageUrl(id))
      : null,
  }
}
