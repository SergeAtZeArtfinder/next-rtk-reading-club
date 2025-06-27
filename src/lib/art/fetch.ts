import type {
  ArtworkTypesApiResponse,
  ArtsApiSearchResponse,
  ArtworksQueryParams,
  ArtworkDetails,
  ArtworkDetailsApiResponse,
} from "@/types"

import {
  getArtworkTypesUrl,
  formatArtworksList,
  getArtsListEndpointUrl,
  getArtworkDetailsEndpointUrl,
  formatArtworkDetails,
} from "./utils"
import defaultArtworkTypes from "./static/artworkTypes.json"

export const fetchArtworkTypesSSR = async (limit = 44) => {
  try {
    const response = await fetch(getArtworkTypesUrl(limit))

    if (!response.ok) {
      throw new Error("Failed to fetch artwork types")
    }
    const data = (await response.json()) as ArtworkTypesApiResponse

    return data.data
  } catch (error) {
    console.error("Error fetching artwork types:", error)
    // Fallback to default data if fetch fails
    return defaultArtworkTypes as ArtworkTypesApiResponse["data"]
  }
}

export const fetchArtworksSSR = async (
  params: ArtworksQueryParams,
): Promise<Pick<ArtsApiSearchResponse, "pagination" | "data"> | null> => {
  try {
    const { page, limit = 12, search, artworkType } = params
    const url = getArtsListEndpointUrl({ page, limit, search, artworkType })

    const res = await fetch(url)
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(responseData.error || "Failed to fetch artworks")
    }
    const { pagination, data } = responseData as ArtsApiSearchResponse

    return {
      pagination: {
        ...pagination,
        search: search || null,
        artworkType: artworkType || null,
      },
      data: formatArtworksList(data),
    }
  } catch (error) {
    return null
  }
}

export const fetchArtworkByIdSSR = async (
  artworkId: string,
): Promise<ArtworkDetails | null> => {
  try {
    const url = getArtworkDetailsEndpointUrl(artworkId)
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Failed to fetch artwork with ID: ${artworkId}`)
    }

    const responseData = (await res.json()) as ArtworkDetailsApiResponse
    return formatArtworkDetails(responseData.data)
  } catch (error) {
    return null
  }
}
