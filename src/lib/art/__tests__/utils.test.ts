import type { ArtworkDetails } from "@/types"

import {
  getArtsListEndpointUrl,
  getArtworkDetailsEndpointUrl,
  getArtImageUrl,
  getArtworkTypesUrl,
  formatArtworksList,
  formatArtworkDetails,
  artworkDetailsFields,
} from "@/lib/art"

describe("Art utils", () => {
  const { artworks, artworkDetails } = getTestData()
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

  it("should return artwork URL by ID from getArtworkDetailsEndpointUrl", () => {
    expect(getArtworkDetailsEndpointUrl("123")).toEqual(
      `https://arts-mock-api/v1/artworks/123?fields=${artworkDetailsFields.join(",")}`,
    )
  })

  it("should return image URL by ID from getArtImageUrl", () => {
    expect(getArtImageUrl("image123")).toEqual(
      "https://arts-mock-api/images/image123/full/843,/0/default.jpg",
    )
  })

  it("should return artwork types URL with limit from getArtworkTypesUrl", () => {
    expect(getArtworkTypesUrl(20)).toEqual(
      "https://api.artic.edu/api/v1/artwork-types?limit=20&fields=id,title,aat_id",
    )
  })

  it("should format artworks list correctly", () => {
    const formatted = formatArtworksList(artworks)
    expect(formatted).toEqual([
      {
        id: 1,
        title: "Starry Night",
        classification_title: "Painting",
        artwork_type_title: "Oil on canvas",
        artwork_type_id: "painting",
        artist_display: "Vincent van Gogh",
        date_display: "1889",
        short_description: "A famous painting by Vincent van Gogh.",
        main_reference_number: "123456",
        image_id: "image1",
        image_url:
          "https://arts-mock-api/images/image1/full/843,/0/default.jpg",
      },
    ])
  })

  it("should format artwork details correctly", () => {
    const formatted = formatArtworkDetails(artworkDetails[0])
    expect(formatted).toEqual({
      ...artworkDetails[0],
      image_url:
        "https://arts-mock-api/images/0ca42060-6e7c-7565-4745-9b396731b53e/full/843,/0/default.jpg",
      alt_image_urls: [
        "https://arts-mock-api/images/imageId1/full/843,/0/default.jpg",
        "https://arts-mock-api/images/imageId2/full/843,/0/default.jpg",
      ],
    })
  })
  it("should format artwork details correctly if no alt images", () => {
    const formatted = formatArtworkDetails(artworkDetails[1])
    expect(formatted).toEqual({
      ...artworkDetails[1],
      image_url:
        "https://arts-mock-api/images/3dcb169e-b73e-6d52-6ac5-525b67e5b8b7/full/843,/0/default.jpg",
      alt_image_urls: null,
    })
  })
})

function getTestData() {
  return {
    artworks: [
      {
        id: 1,
        title: "Starry Night",
        classification_title: "Painting",
        artwork_type_title: "Oil on canvas",
        artwork_type_id: "painting",
        artist_display: "Vincent van Gogh",
        date_display: "1889",
        short_description: "A famous painting by Vincent van Gogh.",
        main_reference_number: "123456",
        image_id: "image1",
      },
    ],
    artworkDetails: [
      {
        id: 25113,
        title:
          "Peonies and Butterfly, from an untitled series of large flowers",
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
      },
      {
        id: 7988,
        title: "Claude Monet",
        alt_titles: null,
        date_display: "1922",
        artist_display: "Albert André (French, 1869-1954)",
        place_of_origin: "France",
        description: null,
        short_description: null,
        dimensions:
          "129.5 × 96.5 cm (51 × 38 in.); Framed: 158.3 × 125.8 × 12.1 cm (62 5/16 × 49 1/2 × 4 3/4 in.)",
        medium_display: "Oil on canvas",
        publication_history:
          'M. B. W., "Portrait of Monet by André," Bulletin of the Art Institute of Chicago 17 no. 3 (March 1923): 32-33 (ill.).\n\n"Accessions and Loans," Bulletin of the Art Institute of Chicago 17 no. 3 (March 1923): 35.\n\nArt Institute of Chicago Newsletter (December 1921-December 1923): 127 no. 5.\n\n“Andre’s ‘Monet’ for Chicago Institute,” Art News 21 (February 17, 1923): 1.\n\nMuriel Ciolkowska, “The Art of André,” International Studio 76 (1923) plate opp. 455 (color ill.).\n\nM. C., "Monets in the Art Institute," Bulletin of the Art Institute of Chicago 19, no. 2 (1925): 18 (ill.), 21.\n\nArt Institute of Chicago, A Guide to the Paintings in the Permanent Collection (Chicago: Art Institute: 1925), 74, 125 no. 620, as Claude Monet (in his Garden at Giverny).\n\nMarius Mermillon, Albert André (Paris: G. Crès & cie, c. 1927) plate 37.\n\nArt Institute of Chicago, A Guide to the Paintings in the Permanent Collection (Chicago: Art Institute: 1932) 75, 141, as Claude Monet (in his Garden at Giverny).\n\nPictures on Exhibit 8, no. 10 (July 1946): 2 (ill.).\n\nA. C., “Homage to Claude Monet,” The Art Institute of Chicago Quarterly LI, no. 2 (April 1, 1957): 28 (ill.).\n\n“Monet and the Giverny Group,” Bulletin of the Dayton Art Institute, 19, no. 3 (December 1960) n.p. (ill.).\n\nArt Institute of Chicago, Paintings in the Art Institute: A Catalogue of the Picture Collection (Chicago: Art Institute of Chicago, 1961), 15.\n\nA. James Speyer, Twentieth-Century European Paintings, compiled by Courtney Graham Donnell. (Chicago and London: The University of Chicago Press, 1980), 13, 31 no. 1A4, plate 1A4.\n\nEvelyne Yeatman, Albert André (Association pour létude de l\'oeuvre d\'Albert André, 1990), 29 (ill.).',
        exhibition_history:
          "Dayton, Ohio, Dayton Art Institute, Monet and the Giverny Group, Jan. 6 – Feb. 12, 1961, cat. 1; Davenport, Iowa, Municipal Art Gallery, Mar. 11 – Apr. 5, 1961; Tucson, University of Arizona, Apr. 19 – May 10, 1961; Reno, University of Nevada, Oct. 21–Nov. 11, 1961; San Diego, California, Fine Arts Gallery, Nov. 30 – Dec. 23, 1961; Atlanta, Georgia, Atlanta Art Association, Jan. 7–28, 1962.\n\nShort term loan to Mr. and Mrs. B.E. Bensinger, Chicago, January 17 – April 6, 1973.\n\nShort term loan to Mr. and Mrs. B.E. Bensinger, Chicago, April 18 – May 18, 1973.\n\nBeijing, Palace Museum, Garden Cultures of China and the West, Apr. 1–June 30, 2025; Suzhou Museum, July 19–Oct. 31, 2025; Ningbo Museum, Dec. 5, 2025–Mar. 8, 2026; Hong Kong Museum of Art, Apr. 23–July 29, 2026.\n\nBeijing, Palace Museum, Rejoicing in Woods and Springs: A Journey through Garden Cultures in China and the Wider World, Apr. 1–June 30, 2025; Suzhou China, Suzhou Museum, July 19–Oct. 31, 2025; Ningbo, China, Ningbo Museum, Dec. 5, 2025–Mar. 8, 2026; Hong Kong Museum of Art, Apr. 23–July 29, 2026.",
        provenance_text:
          "The artist; sold to Durand-Ruel, Paris, July, 20, 1922 [this and the following according to correspondence with France Daguet, Durand-Ruel & Cie., Mar. 7, 1986, in curatorial object file]; sent to Galerie Durand-Ruel, New York, Nov. 2, 1922; sold to the Art Institute of Chicago, Feb. 14, 1923.",
        copyright_notice: null,
        artwork_type_title: "Painting",
        artwork_type_id: 1,
        artist_title: "Albert André",
        classification_title: "oil on canvas",
        classification_titles: [
          "oil on canvas",
          "portrait",
          "european painting",
          "painting",
          "modern and contemporary art",
        ],
        source_updated_at: "2025-06-27T00:30:14-05:00",
        image_id: "3dcb169e-b73e-6d52-6ac5-525b67e5b8b7",
        alt_image_ids: null,
      },
    ] as ArtworkDetails[],
  }
}
