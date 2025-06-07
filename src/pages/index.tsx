import Head from "next/head"
import Script from "next/script"

import type { GetServerSideProps, NextPage } from "next"
import type { Book } from "@/types"

import { wrapper } from "@/lib/redux/store/wrapper"
import { setBooks } from "@/lib/redux/slices/booksSlice"
import { getJsonSchema } from "@/lib/seo/homepage"
import { getAllBooks } from "@/lib/db/books"
import BooksList from "@/components/books/BooksList"

interface PageProps {
  jsonSchema: ReturnType<typeof getJsonSchema>
}

const HomePage: NextPage<PageProps> = ({ jsonSchema }) => {
  return (
    <>
      <Head>
        <title>{jsonSchema[0].name}</title>
        <meta name="description" content={jsonSchema[0].description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={jsonSchema[0].name} />
        <meta property="og:description" content={jsonSchema[0].description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={jsonSchema[0].url} />
        <meta property="robots" content="index, follow" />
      </Head>
      <Script
        id="jsonld-books"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonSchema) }}
      />

      <h1 className="text-3xl font-bold text-center my-8">
        Reading clubb{" "}
        <small className="text-xs italic text-secondary">
          look in zee boook...
        </small>
      </h1>
      <BooksList />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  wrapper.getServerSideProps((store) => async ({ res }) => {
    let books: Book[] | null = null
    try {
      books = await getAllBooks()
    } catch (error) {
      books = null
    }
    books && store.dispatch(setBooks(books))
    const jsonSchema = getJsonSchema({ books: books || [] })

    return {
      props: {
        jsonSchema,
      },
    }
  })

export default HomePage
