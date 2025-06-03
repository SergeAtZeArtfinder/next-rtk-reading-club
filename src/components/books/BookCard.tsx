"use client"

import React, { type MouseEvent } from "react"
import { Card, CardBody, Image, Button, addToast } from "@heroui/react"
import { useDispatch } from "react-redux"
import { useSession } from "next-auth/react"

import type { Book } from "@/types"

import { AppDispatch } from "@/lib/redux/store/index"
import { deleteBookById } from "@/lib/redux/slices/booksSlice"
interface Props {
  book: Book
}

const BookCard = ({ book }: Props): JSX.Element => {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const userId = session?.user?.id || ""
  const role = session?.user?.role || "user"
  const isOwner = book.userId === userId || role === "ADMIN"

  const handleDelete = async (event: MouseEvent) => {
    event.preventDefault()
    if (!isOwner) return
    const action = await dispatch(deleteBookById({ bookId: book.id }))
    if (deleteBookById.fulfilled.match(action)) {
      addToast({
        title: "Book deleted successfully",
        color: "success",
      })
    } else {
      addToast({
        title: "Failed to delete book",
        color: "danger",
      })
    }
  }

  return (
    <Card as="li" className="w-full grid grid-rows-subgrid row-[span_5]">
      <CardBody
        as="a"
        href={book.externalLink}
        target="_blank"
        className="grid grid-rows-subgrid row-[span_5] hover:opacity-80 transition-opacity duration-200 ease-in-out relative"
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
        {isOwner && (
          <Button
            onClick={handleDelete}
            color="secondary"
            className="absolute bottom-2 right-2 z-50"
          >
            Delete
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default BookCard
