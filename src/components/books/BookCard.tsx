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
      <CardBody className="row-[span_5]">
        <Image
          alt="Book cover"
          radius="sm"
          src={book.images[0]}
          width={300}
          className="aspect-square object-cover"
        />
        <p className="text-md">{book.title}</p>
        <p className="text-md">Genre: {book.genre}</p>
        <p className="text-md">By {book.author}</p>
        <p className="text-small text-default-500">{book.description}</p>
      </CardBody>
    </Card>
  )
}

export default BookCard
