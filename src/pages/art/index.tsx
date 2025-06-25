import React from "react"
import Head from "next/head"
import { z } from "zod"

import type { NextPage, GetServerSideProps } from "next"
import type { ArtworksQueryParams, ArtsApiSearchResponse } from "@/types"

import { getArtsListEndpointUrl, formatArtworksList } from "@/lib/art"
import { setArtworks, setArtworksError } from "@/lib/redux/slices/artworksSlice"
import { wrapper } from "@/lib/redux/store"
import ArtworksList from "@/components/artworks/ArtworksList"

const fetchArtworksSSR = async (
  params: ArtworksQueryParams,
): Promise<Pick<ArtsApiSearchResponse, "pagination" | "data"> | null> => {
  try {
    const { page, limit = 12, search } = params
    const url = getArtsListEndpointUrl({ page, limit, search })

    const res = await fetch(url)
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(responseData.error || "Failed to fetch artworks")
    }
    const { pagination, data } = responseData as ArtsApiSearchResponse

    return {
      pagination: { ...pagination, search: search || null },
      data: formatArtworksList(data),
    }
  } catch (error) {
    return null
  }
}

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
})

interface PageProps {}

const ArtworksPage: NextPage<PageProps> = ({}) => {
  return (
    <>
      <Head>
        <title>Artworks</title>
        <meta name="description" content="Artworks page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className=" text-3xl my-8 text-center">Artworks</h1>
        <ArtworksList />
      </>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  wrapper.getServerSideProps((store) => async ({ res, query }) => {
    const queryParams = queryParamsSchema.safeParse(query)

    if (!queryParams.success) {
      return {
        props: {},
      }
    }

    const { page, limit, search } = queryParams.data

    const artworks = await fetchArtworksSSR({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search: search || undefined,
    })

    if (artworks) {
      store.dispatch(setArtworks(artworks))
    } else {
      store.dispatch(setArtworksError("Failed to fetch artworks on server"))
    }

    return {
      props: {},
    }
  })

export default ArtworksPage
