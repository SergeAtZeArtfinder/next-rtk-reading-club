import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Pagination, Button, addToast } from "@heroui/react"
import { useRouter } from "next/router"

import type { RootState, AppDispatch } from "@/lib/redux/store"

import { fetchArtworks } from "@/lib/redux/slices/artworksSlice"
import ArtworkCard from "../ArtworkCard"
import ArtworksListSkeleton from "./Skeleton"
import { ParsedUrlQuery } from "querystring"
import { ad } from "vitest/dist/chunks/reporters.d.DL9pg5DB.js"

const useScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return showScrollTop
}

const getPaginationInfo = ({
  artworks,
  query,
}: {
  artworks: RootState["artworks"]
  query: ParsedUrlQuery
}) => {
  const { page = "1", limit = "12", search } = query
  return {
    currentPaginationTotalPages: artworks.data?.pagination.total_pages || 10,
    currentPaginationPage: artworks.data?.pagination.current_page || 1,
    currentPaginationLimit: artworks.data?.pagination.limit || 12,
    currentPaginationSearchTerm: artworks.data?.pagination.search || null,
    currentRouterPage: parseInt(page as string, 10) || 1,
    currentRouterLimit: parseInt(limit as string, 10) || 12,
    currentRouterSearchTerm: search ? (search as string) : null,
  }
}

const ArtworksList = (): JSX.Element => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const artworks = useSelector((state: RootState) => state.artworks)
  const showScrollTop = useScrollToTop()

  const {
    currentPaginationTotalPages,
    currentPaginationPage,
    currentPaginationLimit,
    currentPaginationSearchTerm,
    currentRouterPage,
    currentRouterLimit,
    currentRouterSearchTerm,
  } = getPaginationInfo({ artworks, query: router.query })

  const handlePaginateRouter = (page: number) => {
    const query = { ...router.query }

    if (page > 0) {
      query.page = String(page)
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
      currentPaginationSearchTerm !== currentRouterSearchTerm

    if (!hasPaginationChanged) return

    dispatch(
      fetchArtworks({
        page: currentRouterPage,
        limit: currentRouterLimit,
        search: currentRouterSearchTerm || undefined,
      }),
    )
  }, [
    currentPaginationPage,
    currentRouterPage,
    currentPaginationLimit,
    currentRouterLimit,
    currentPaginationSearchTerm,
    currentRouterSearchTerm,
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

      {/* 3. Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={handleScrollToTop}
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
