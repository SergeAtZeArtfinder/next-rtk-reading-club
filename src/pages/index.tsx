import type { GetServerSideProps } from "next"
import type { Book } from "@/types"

import { wrapper } from "@/lib/redux/store/wrapper"
import { setBooks } from "@/lib/redux/slices/booksSlice"
import BooksList from "@/components/books/BooksList"
import { getAllBooks } from "@/lib/db/books"

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8">
        Hello, Redux RTK Polygon
      </h1>
      <div className="flex justify-center items-center h-screen w-auto mx-auto">
        <BooksList />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async () => {
    let books: Book[] | null = null
    try {
      books = await getAllBooks()
    } catch (error) {
      books = null
    }
    books && store.dispatch(setBooks(books))
    return { props: {} }
  })

export default HomePage
