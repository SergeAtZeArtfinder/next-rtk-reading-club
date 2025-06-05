"use client"

import React, { type MouseEvent } from "react"
import { Card, CardBody, Image, Button, addToast } from "@heroui/react"
import { useDispatch, useSelector } from "react-redux"
import { MdDeleteOutline } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import { useSession } from "next-auth/react"
import Link from "next/link"

import type { Book } from "@/types"
import type { AppDispatch, RootState } from "@/lib/redux/store/index"

import { deleteBookById } from "@/lib/redux/slices/booksSlice"
import { paths } from "@/lib/utils"
interface Props {
  book: Book
}

const BookCard = ({ book }: Props): JSX.Element => {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.books)
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
      <CardBody className="grid grid-rows-subgrid row-[span_5] cursor-pointer relative card-border-overlay transition-all hover:opacity-75 duration-200 ease-in-out">
        <a
          href={book.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 bottom-0 right-0 left-0"
        />
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
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button
              as={Link}
              href={paths.editBook(book.id)}
              startContent={<FaEdit size={24} />}
              size="sm"
              color="warning"
              className=" disabled:bg-gray-500 px-2"
              disabled={loading}
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              size="sm"
              color="danger"
              className=" disabled:bg-gray-500 px-2"
              disabled={loading}
              startContent={<MdDeleteOutline size={24} />}
            >
              Delete
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default BookCard
