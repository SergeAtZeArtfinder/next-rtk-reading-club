"use client"

import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/lib/redux/store/index"
import { fetchBooks } from "@/lib/redux/slices/booksSlice"

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
    <>
      {books.loading && <p>Loading...</p>}
      {books.error && <p>{books.error}</p>}
      <ul className="w-full grid gap-2 grid-cols-gallery">
        {books.data?.map((book) => (
          <li key={book.id} className="border p-4">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p>{book.author}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BooksList
