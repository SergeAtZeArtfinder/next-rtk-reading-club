import { getServerSession } from "next-auth"
import Head from "next/head"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

import type { GetServerSideProps, NextPage } from "next"
import type { RootState } from "@/lib/redux/store"
import type { Book } from "@/types"

import { getAllBooks } from "@/lib/db/books"
import { setBooks } from "@/lib/redux/slices/booksSlice"
import { wrapper } from "@/lib/redux/store"
import { authOptions } from "@/lib/auth"
import BookForm from "@/components/forms/BookForm"
import { isUserAuthorised } from "@/lib/db"

const EditBookPage: NextPage = () => {
  const router = useRouter()
  const books = useSelector((state: RootState) => state.books)
  const book = books.data?.find(
    (current) => current.id === (router.query.bookId as string),
  )

  if (!book && !books.loading) {
    return router.push("/404")
  }

  return (
    <>
      <Head>
        <title>Edit Book</title>
        <meta name="description" content="Edit Book" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold text-center my-8">Edit Book</h1>
      <BookForm book={book} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ params, req, res }) => {
    /**
     * Check if the user is authenticated and authorised to edit the book.
     */
    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user.id
    if (!userId) {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      }
    }
    const bookId = params?.bookId as string
    const isAuthorised = await isUserAuthorised({ bookId, userId })
    if (!isAuthorised) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      }
    }

    /**
     * Fetch all books and dispatch them to the Redux store.
     */
    let books: Book[] | null = null
    try {
      books = await getAllBooks()
    } catch (error) {
      books = null
    }
    books && store.dispatch(setBooks(books))

    return { props: { bookId } }
  })

export default EditBookPage
