"use client"

import React from "react"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react"

import type { Book } from "@/types"

interface Props {
  book: Book
}

const BookCard = ({ book }: Props): JSX.Element => {
  return (
    <Card as="li" className="w-full grid grid-rows-subgrid row-[span_5]">
      <CardBody
        as="a"
        href={book.externalLink}
        target="_blank"
        className="grid grid-rows-subgrid row-[span_5] hover:opacity-80 transition-opacity duration-200 ease-in-out"
      >
        <Image
          alt="Book cover"
          radius="sm"
          src={book.images[0]}
          width={300}
          className="aspect-square object-cover"
        />
        <p className="text-xl font-semibold">{book.title}</p>
        <p className="text-md text-secondary">Genre: {book.genre}</p>
        <p className="text-lg text-secondary">By {book.author}</p>
        <p className="text-small text-default-500">{book.description}</p>
      </CardBody>
    </Card>
  )
}

export default BookCard
