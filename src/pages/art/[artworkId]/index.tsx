import React from "react"
import Head from "next/head"

import type { NextPage, GetServerSideProps } from "next"
import type { ArtworkDetailsApiResponse, ArtworkDetails } from "@/types"

import { getArtworkDetailsEndpointUrl, formatArtworkDetails } from "@/lib/art"
import ArtworkDetailsDescription from "@/components/artworks/sections/ArtworkDetailsDescription"
import ArtworkDetailsHistory from "@/components/artworks/sections/ArtworkDetailsHistory"
import ArtworkDetailsHero from "@/components/artworks/sections/ArtworkDetailsHero"
import ArtworkDetailsInfo from "@/components/artworks/sections/ArtworkDetailsInfo"

const fetchArtworkByIdSSR = async (
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

interface PageProps {
  artworkDetails: ArtworkDetails
}

const ArtworkDetailsPage: NextPage<PageProps> = ({ artworkDetails }) => {
  return (
    <>
      <Head>
        <title>Artwork details</title>
        <meta name="description" content="Artwork details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="text-3xl font-bold text-center my-8">
          {artworkDetails.title}
        </h1>
        <ArtworkDetailsHero
          as={"section"}
          aria-label="hero brief about the artwork"
          className="mb-8"
          imageUrl={artworkDetails.image_url}
          title={artworkDetails.title}
          artist={artworkDetails.artist_title}
          dateDisplayed={artworkDetails.date_display}
          description={artworkDetails.short_description}
          dimensions={artworkDetails.dimensions}
          mediumDisplay={artworkDetails.medium_display}
          classificationTitle={artworkDetails.classification_title}
          altClassificationTitles={artworkDetails.classification_titles}
        />

        <ArtworkDetailsDescription
          as={"section"}
          aria-label="artwork description"
          className="mb-8"
          description={artworkDetails.description}
        />

        <ArtworkDetailsHistory
          as={"section"}
          aria-label="artwork provenance and exhibition history"
          className="mb-8"
          provenanceText={artworkDetails.provenance_text}
          exhibitionHistory={artworkDetails.exhibition_history}
          publicationHistory={artworkDetails.publication_history}
        />

        <ArtworkDetailsInfo
          as={"section"}
          aria-label="artwork additional information"
          sourceUpdatedAt={artworkDetails.source_updated_at}
          copyrightNotice={artworkDetails.copyright_notice}
        />
      </>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const artworkId = ctx.query.artworkId as string
  const artworkDetails = await fetchArtworkByIdSSR(artworkId)

  if (!artworkDetails) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }
  }

  return {
    props: { artworkDetails },
  }
}

export default ArtworkDetailsPage
