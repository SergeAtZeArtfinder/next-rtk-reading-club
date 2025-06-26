import React from "react"
import Head from "next/head"
import { z } from "zod"

import type { NextPage, GetServerSideProps } from "next"
import type { ArtworkType } from "@/types"

import { fetchArtworkTypesSSR, fetchArtworksSSR } from "@/lib/art"
import { setArtworks, setArtworksError } from "@/lib/redux/slices/artworksSlice"
import { wrapper } from "@/lib/redux/store"
import ArtworksList from "@/components/artworks/ArtworksList"
import ArtworksFilter from "@/components/artworks/ArtworksFilter"

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  artworkType: z.string().optional(),
})

interface PageProps {
  content: {
    artworkTypes: ArtworkType[]
  }
}

const ArtworksPage: NextPage<PageProps> = ({ content }) => {
  return (
    <>
      <Head>
        <title>Artworks</title>
        <meta name="description" content="Artworks page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className=" text-3xl my-8 text-center">Artworks</h1>
        <ArtworksFilter artworkTypes={content.artworkTypes} />
        <ArtworksList />
      </>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  wrapper.getServerSideProps((store) => async ({ res, query }) => {
    const queryParams = queryParamsSchema.parse(query)

    const { page, limit, search, artworkType } = queryParams

    const artworks = await fetchArtworksSSR({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search: search || undefined,
      artworkType: artworkType || undefined,
    })

    if (artworks) {
      store.dispatch(setArtworks(artworks))
    } else {
      store.dispatch(setArtworksError("Failed to fetch artworks on server"))
    }

    const artworkTypes = await fetchArtworkTypesSSR()

    return {
      props: {
        content: {
          artworkTypes,
        },
      },
    }
  })

export default ArtworksPage
