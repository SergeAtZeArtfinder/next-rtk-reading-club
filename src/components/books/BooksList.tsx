"use client"

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import type { RootState, AppDispatch } from "@/lib/redux/store"

import { fetchBooks } from "@/lib/redux/slices/booksSlice"
import BookCard from "./BookCard"

const BooksList = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const books = useSelector((state: RootState) => state.books)
  const shouldFetch = !books.data?.length

  /**
   * Fetch books from the API if they are not already in the store.
   * - IF prefetched on SSR, then do not fetch.
   */
  useEffect(() => {
    if (shouldFetch) {
      dispatch(fetchBooks())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch])

  return (
    <div className="mt-8">
      {books.loading && <p>Loading...</p>}
      {books.error && <p>{books.error}</p>}
      <ul
        className="w-full grid gap-2 grid-cols-gallery"
        aria-label="Books list"
      >
        {books.data?.map((book) => <BookCard key={book.id} book={book} />)}
      </ul>
    </div>
  )
}

export default BooksList
