import { getArtsListEndpointUrl } from "@/lib/art"

describe("Art utils", () => {
  describe("getArtsListEndpointUrl", () => {
    it("should return correct URL with all parameters", () => {
      const params = {
        page: 2,
        limit: 10,
        search: "starry night",
        artworkType: "painting",
      }
      const url = getArtsListEndpointUrl(params)
      expect(url).toBe(
        "https://arts-mock-api/v1/artworks/search?fields=id,title,classification_title,artwork_type_title,artwork_type_id,artist_display,date_display,short_description,main_reference_number,image_id&page=2&limit=10&q=starry%20night&query[term][artwork_type_id]=painting",
      )
    })

    it("should handle default parameters", () => {
      const url = getArtsListEndpointUrl({})
      expect(url).toBe(
        "https://arts-mock-api/v1/artworks?fields=id,title,classification_title,artwork_type_title,artwork_type_id,artist_display,date_display,short_description,main_reference_number,image_id&page=1&limit=12",
      )
    })
  })
})
