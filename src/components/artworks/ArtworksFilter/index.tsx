"use client"

import React from "react"
import {
  Card,
  CardBody,
  Select,
  SelectSection,
  SelectItem,
  Button,
} from "@heroui/react"
import { useRouter } from "next/router"

import type { ArtworkType } from "@/types"

interface Props {
  artworkTypes: ArtworkType[]
}

const ArtworksFilter = ({ artworkTypes }: Props): JSX.Element => {
  const router = useRouter()
  const currentTypeId = router.query.artworkType as string | undefined

  const handleChangeArtworkType = (typeId: string) => {
    const currentQuery = { ...router.query }

    if (!typeId) {
      // If no type is selected, remove the filter from the query
      delete currentQuery["artworkType"]
    } else {
      currentQuery["artworkType"] = typeId
    }

    router.push(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true },
    )
  }

  const handleReset = () => {
    const [_, queryParams] = router.asPath.split("?")
    if (!queryParams) {
      // If there are no query params, do nothing
      return
    }
    router.push(router.pathname, undefined, { shallow: true })
  }

  return (
    <Card className="mb-8">
      <CardBody className="w-full grid gap-2 grid-cols-gallery">
        <Select
          label="Filter by Type"
          onChange={(event) => {
            handleChangeArtworkType(event.target.value)
          }}
          selectedKeys={[currentTypeId || ""]}
        >
          {artworkTypes.map(({ id, title }) => (
            <SelectItem key={id}>{title}</SelectItem>
          ))}
        </Select>
        <div></div>
        <Button onPress={handleReset} className="h-full">
          reset
        </Button>
      </CardBody>
    </Card>
  )
}

export default ArtworksFilter
