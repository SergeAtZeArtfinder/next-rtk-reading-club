const baseUrl = process.env.NEXT_PUBLIC_ART_BASE_URL
const imageBaseUrl = process.env.NEXT_PUBLIC_ART_IMAGE_BASE_URL

const getArtEndpointUrl = ({
  page,
  limit = 12,
  search,
}: {
  page?: number
  limit?: number
  search?: string
}) => {
  const pagination = page ? `&page=${page}&limit=${limit}` : ""
  const searchText = search ? `&q=${encodeURIComponent(search)}` : ""

  return `${baseUrl}/artworks${search ? "/search" : ""}?fields=id,title,classification_title,artist_display,date_display,short_description,main_reference_number,image_id${searchText}${pagination}`
}

const getArtImageUrl = (imageId: string) => {
  return `${imageBaseUrl}/${imageId}/full/843,/0/default.jpg`
}
