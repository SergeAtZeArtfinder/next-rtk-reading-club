import Head from "next/head"

import type { NextPage } from "next"

import BookForm from "@/components/forms/BookForm"

const AddBookPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Add New Book</title>
        <meta name="description" content="Add New Book" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold text-center my-8">Add Book</h1>
      <BookForm />
    </>
  )
}

export default AddBookPage
