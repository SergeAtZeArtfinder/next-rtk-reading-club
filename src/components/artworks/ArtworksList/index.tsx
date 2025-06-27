"use client"

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Pagination, Button, addToast } from "@heroui/react"
import { useRouter } from "next/router"

import type { ParsedUrlQuery } from "querystring"
import type { RootState, AppDispatch } from "@/lib/redux/store"

import { fetchArtworks } from "@/lib/redux/slices/artworksSlice"
import ArtworkCard from "../ArtworkCard"
import ArtworksListSkeleton from "./Skeleton"
import { useScrollToTop } from "./useScrollToTop"

const getPaginationInfo = ({
  artworks,
  query,
}: {
  artworks: RootState["artworks"]
  query: ParsedUrlQuery
}) => {
  const { page = "1", limit = "12", search, artworkType } = query

  return {
    currentPaginationTotalPages: artworks.data?.pagination.total_pages || 10,
    currentPaginationPage: artworks.data?.pagination.current_page || 1,
    currentPaginationLimit: artworks.data?.pagination.limit || 12,
    currentPaginationSearchTerm: artworks.data?.pagination.search || null,
    currentPaginationArtworkType: artworks.data?.pagination.artworkType || null,
    currentRouterPage: parseInt(page as string, 10),
    currentRouterLimit: parseInt(limit as string, 10),
    currentRouterSearchTerm: search ? (search as string) : null,
    currentRouterArtworkType: artworkType ? (artworkType as string) : null,
  }
}

const ArtworksList = (): JSX.Element => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const artworks = useSelector((state: RootState) => state.artworks)
  const isScrollTopButton = useScrollToTop()

  const {
    currentPaginationTotalPages,
    currentPaginationPage,
    currentPaginationLimit,
    currentPaginationSearchTerm,
    currentRouterPage,
    currentRouterLimit,
    currentRouterSearchTerm,
    currentRouterArtworkType,
    currentPaginationArtworkType,
  } = getPaginationInfo({ artworks, query: router.query })

  const handlePaginateRouter = (page: number) => {
    const query = { ...router.query }

    if (page > 0) {
      query.page = `${page}`
    } else {
      delete query.page
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    )
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const hasPaginationChanged =
      currentPaginationPage !== currentRouterPage ||
      currentPaginationLimit !== currentRouterLimit ||
      currentPaginationSearchTerm !== currentRouterSearchTerm ||
      currentPaginationArtworkType !== currentRouterArtworkType

    if (!hasPaginationChanged) return

    dispatch(
      fetchArtworks({
        page: currentRouterPage,
        limit: currentRouterLimit,
        search: currentRouterSearchTerm || undefined,
        artworkType: currentRouterArtworkType || undefined,
      }),
    )
  }, [
    currentPaginationPage,
    currentRouterPage,
    currentPaginationLimit,
    currentRouterLimit,
    currentPaginationSearchTerm,
    currentRouterSearchTerm,
    currentRouterArtworkType,
    currentPaginationArtworkType,
    dispatch,
  ])

  useEffect(() => {
    if (!artworks.error) return

    addToast({
      title: artworks.error,
      color: "danger",
    })
  }, [artworks.error])

  return (
    <div>
      {artworks.loading && <ArtworksListSkeleton items={12} />}

      <ul
        className="w-full grid gap-2 grid-cols-gallery "
        aria-label="Artworks list"
      >
        {artworks.data?.data.map((artwork) => (
          <li
            key={artwork.id}
            aria-label={`Artwork item ${artwork.title}`}
            className="grid grid-rows-subgrid row-[span_5]"
          >
            <ArtworkCard artwork={artwork} />
          </li>
        ))}
      </ul>

      {artworks.data && artworks.data.pagination.total_pages > 1 && (
        <div className="mt-8 py-4 flex justify-center">
          <Pagination
            initialPage={1}
            total={currentPaginationTotalPages}
            page={currentRouterPage}
            onChange={handlePaginateRouter}
            color="warning"
          />
        </div>
      )}

      {isScrollTopButton && (
        <Button
          onPress={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:border-yellow-800 hover:text-yellow-800 active:border-yellow-900 transition-opacity duration-300"
          color="warning"
          variant="bordered"
        >
          ↑ Scroll to top
        </Button>
      )}
    </div>
  )
}

export default ArtworksList
