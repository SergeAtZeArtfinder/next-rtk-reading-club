import React from "react"
import { useSelector, useDispatch } from "react-redux"

import type { RootState, AppDispatch } from "@/lib/redux/store"
import type { ArtworkSummary } from "@/types"

import ArtworkCard from "../ArtworkCard"
import ArtworksListSkeleton from "./Skeleton"

const ArtworksList = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const artworks = useSelector((state: RootState) => state.artworks)

  return (
    <div>
      {artworks.loading && <ArtworksListSkeleton items={6} />}
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

      {/* PAGINATION */}
    </div>
  )
}

export default ArtworksList
