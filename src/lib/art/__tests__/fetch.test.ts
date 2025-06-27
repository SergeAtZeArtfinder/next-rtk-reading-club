import type {
  ArtsApiSearchResponse,
  ArtworkTypesApiResponse,
  ArtworkDetails,
} from "@/types"

import {
  fetchArtworkTypesSSR,
  fetchArtworksSSR,
  fetchArtworkByIdSSR,
} from "@/lib/art/fetch"
import { artworkDetailsFields } from "@/lib/art/utils"
import defaultArtworkTypes from "@/lib/art/static/artworkTypes.json"

describe("fetch artwork utils", () => {
  const mockFetch = vi.fn()
  globalThis.fetch = mockFetch

  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe("fetchArtworkTypesSSR", () => {
    const mockSuccessResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          pagination: {
            total: 44,
            limit: 2,
            offset: 0,
            total_pages: 22,
            current_page: 1,
          },
          data: [
            { id: 1, title: "Painting", aat_id: "painting" },
            { id: 2, title: "Sculpture", aat_id: "sculpture" },
          ],
          info: {
            license_text:
              "The data in this response is licensed under a Creative Commons Zero (CC0) 1.0",
            license_links: ["https://www.artic.edu/terms"],
            version: "1.13",
          },
          config: {
            website_url: "http://www.artic.edu",
          },
        }),
    }
    let originalConsoleError: typeof console.error

    beforeAll(() => {
      originalConsoleError = console.error
      console.error = vi.fn()
    })

    afterAll(() => {
      console.error = originalConsoleError
    })

    it("should fetch artwork types successfully", async () => {
      mockFetch.mockResolvedValue(mockSuccessResponse)

      const result = await fetchArtworkTypesSSR(2)
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.artic.edu/api/v1/artwork-types?limit=2&fields=id,title,aat_id",
      )
      expect(result).toEqual([
        { id: 1, title: "Painting", aat_id: "painting" },
        { id: 2, title: "Sculpture", aat_id: "sculpture" },
      ])
    })

    it("should return default data on fetch failure", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      const result = await fetchArtworkTypesSSR(2)
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.artic.edu/api/v1/artwork-types?limit=2&fields=id,title,aat_id",
      )
      expect(result).toEqual(
        defaultArtworkTypes as ArtworkTypesApiResponse["data"],
      )
    })

    it("should return default data if response is not ok", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to fetch" }),
      } as Response)

      const result = await fetchArtworkTypesSSR(2)
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.artic.edu/api/v1/artwork-types?limit=2&fields=id,title,aat_id",
      )
      expect(result).toEqual(
        defaultArtworkTypes as ArtworkTypesApiResponse["data"],
      )
    })
  })

  describe("fetchArtworksSSR", () => {
    const mockSuccessResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          pagination: {
            total: 100,
            limit: 10,
            offset: 0,
            total_pages: 10,
            current_page: 1,
          },
          data: [
            {
              id: "1",
              title: "Artwork 1",
              artist_title: "Artist 1",
              image_id: "image1",
              type_title: "Painting",
            },
            {
              id: "2",
              title: "Artwork 2",
              artist_title: "Artist 2",
              image_id: "image2",
              type_title: "Sculpture",
            },
          ],
          info: {
            license_text:
              "The data in this response is licensed under a Creative Commons Zero (CC0) 1.0",
            license_links: ["https://www.artic.edu/terms"],
            version: "1.13",
          },
          config: {
            website_url: "http://www.artic.edu",
          },
        }),
    }

    it("should fetch artworks successfully and return formatted", async () => {
      mockFetch.mockResolvedValue(mockSuccessResponse)

      const result = await fetchArtworksSSR({
        page: 1,
        limit: 10,
        artworkType: "1",
      })
      expect(mockFetch).toHaveBeenCalledWith(
        "https://arts-mock-api/v1/artworks/search?fields=id,title,classification_title,artwork_type_title,artwork_type_id,artist_display,date_display,short_description,main_reference_number,image_id&page=1&limit=10&query[term][artwork_type_id]=1",
      )
      expect(result).toEqual({
        pagination: {
          artworkType: "1",
          total: 100,
          limit: 10,
          offset: 0,
          search: null,
          total_pages: 10,
          current_page: 1,
        },
        data: [
          {
            id: "1",
            title: "Artwork 1",
            artist_title: "Artist 1",
            image_id: "image1",
            image_url:
              "https://arts-mock-api/images/image1/full/843,/0/default.jpg",
            type_title: "Painting",
          },
          {
            id: "2",
            title: "Artwork 2",
            artist_title: "Artist 2",
            image_id: "image2",
            image_url:
              "https://arts-mock-api/images/image2/full/843,/0/default.jpg",
            type_title: "Sculpture",
          },
        ],
      } as unknown as ArtsApiSearchResponse)
    })

    it("should return null if fetch fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      const result = await fetchArtworksSSR({ page: 1, limit: 10 })
      expect(mockFetch).toHaveBeenCalledWith(
        "https://arts-mock-api/v1/artworks?fields=id,title,classification_title,artwork_type_title,artwork_type_id,artist_display,date_display,short_description,main_reference_number,image_id&page=1&limit=10",
      )
      expect(result).toBeNull()
    })
  })

  describe("fetchArtworkByIdSSR", () => {
    const mockArtworkDetails = {
      id: 25113,
      title: "Peonies and Butterfly, from an untitled series of large flowers",
      alt_titles: null,
      date_display: "c. 1833/34",
      artist_display:
        "Katsushika Hokusai 葛飾 北斎\nJapanese, 1760-1849\nPublisher: Hibino Yohachi\nJapanese, unknown",
      place_of_origin: "Japan",
      description: null,
      short_description: null,
      dimensions: "25.4 × 37.7 cm (9 3/4 × 14 1/2 in.)",
      medium_display: "Color woodblock print; oban",
      publication_history: null,
      exhibition_history: null,
      provenance_text: null,
      copyright_notice: null,
      artwork_type_title: "Print",
      artwork_type_id: 18,
      artist_title: "Katsushika Hokusai",
      classification_title: "woodblock print",
      classification_titles: ["woodblock print", "print", "asian art"],
      source_updated_at: "2025-06-27T00:30:14-05:00",
      image_id: "0ca42060-6e7c-7565-4745-9b396731b53e",
      alt_image_ids: ["imageId1", "imageId2"],
    }
    const mockSuccessResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: mockArtworkDetails,
          info: {
            license_text:
              "The data in this response is licensed under a Creative Commons Zero (CC0) 1.0",
            license_links: ["https://www.artic.edu/terms"],
            version: "1.13",
          },
          config: {
            website_url: "http://www.artic.edu",
          },
        }),
    }

    it("should fetch artwork by ID successfully and return formatted", async () => {
      mockFetch.mockResolvedValue(mockSuccessResponse)

      const result = await fetchArtworkByIdSSR("1")
      expect(mockFetch).toHaveBeenCalledWith(
        `https://arts-mock-api/v1/artworks/1?fields=${artworkDetailsFields.join(",")}`,
      )
      expect(result).toEqual({
        ...mockArtworkDetails,
        image_url:
          "https://arts-mock-api/images/0ca42060-6e7c-7565-4745-9b396731b53e/full/843,/0/default.jpg",
        alt_image_urls: [
          "https://arts-mock-api/images/imageId1/full/843,/0/default.jpg",
          "https://arts-mock-api/images/imageId2/full/843,/0/default.jpg",
        ],
      } as ArtworkDetails)
    })

    it("should return null if fetch fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"))

      const result = await fetchArtworkByIdSSR("1")
      expect(mockFetch).toHaveBeenCalledWith(
        `https://arts-mock-api/v1/artworks/1?fields=${artworkDetailsFields.join(",")}`,
      )
      expect(result).toBeNull()
    })
  })
})
