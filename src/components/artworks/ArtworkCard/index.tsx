"use client"

import React from "react"
import { Card, CardBody, Image } from "@heroui/react"

import type { ArtworkSummary } from "@/types"

interface Props {
  artwork: ArtworkSummary
}

const ArtworkCard = ({ artwork }: Props): JSX.Element => {
  return (
    <Card className="grid grid-rows-subgrid row-[span_5]">
      <CardBody className="grid grid-rows-subgrid row-[span_5]">
        <div className="flex flex-col justify-center items-center">
          <Image
            src={artwork.image_url || "/images/artwork_image_placeholder.jpg"}
            alt={`Artwork ${artwork.title}`}
            className="w-full h-64 object-cover mb-4"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          Artist: {artwork.artist_display}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Date: {artwork.date_display}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Classification: {artwork.classification_title}
        </p>
      </CardBody>
    </Card>
  )
}

export default ArtworkCard
