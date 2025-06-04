import Head from "next/head"
import { Card, CardBody, Code } from "@heroui/react"
import clsx from "clsx"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"

const Text = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <Card className="w-full my-4">
      <CardBody className={clsx("text-lg block", className)}>
        {children}
      </CardBody>
    </Card>
  )
}

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>RTK About it</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl font-bold text-center my-8">
          RTK ( Redux Toolkit )
        </h1>
        <Navbar />
        <section>
          <Text>
            Redux Toolkit is the official, recommended approach for writing
            Redux logic.
          </Text>
          <Text>
            It simplifies the standard Redux workflow by providing powerful
            utilities like <Code>createSlice</Code>, <Code>configureStore</Code>
            , and <Code>createAsyncThunk</Code>, which reduce boilerplate and
            make your code more readable and maintainable. Instead of manually
            writing action types, action creators, and reducers, Redux Toolkit
            enables developers to define everything in a more concise and
            structured way, greatly improving the developer experience.
          </Text>
          <Text className="font-semibold">
            One of the key benefits of Redux Toolkit is that it enforces best
            practices out of the box.
          </Text>
          <Text>
            It includes good default configurations like development-mode checks
            for accidental state mutations and serializability, built-in support
            for Redux DevTools, and integration with Redux middleware like{" "}
            <Code className="max-w-[110px]">redux-thunk</Code>.
          </Text>
          <Text>
            Redux Toolkit helps teams manage complex application state in a
            predictable and scalable way—particularly in large apps or those
            requiring advanced patterns like server-side rendering, API data
            caching, or optimistic updates. This makes it especially useful in a
            Next.js application where performance, structure, and SSR support
            are crucial.
          </Text>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-center my-8">
            This app - what is it?
          </h2>
          <Text>
            This app is a simple book club application built with Next.js and
            Redux Toolkit. It allows users to view, add, and manage books in a
            reading list.
          </Text>
          <Text>
            The app uses Redux Toolkit to manage the global state of the book
            list, making it easy to add new books and update the list as needed.
            It also leverages Next.js features like server-side rendering for
            improved performance and SEO.
          </Text>
          <Text>
            The homepage displays a list of books, while the books are being
            pre-fetched on the server side. <Code>getServerSideProps</Code> is
            used to fetch the books from the database and populate the Redux
            store before rendering the page. This ensures that the data is
            always up-to-date and available when the user accesses the app.
          </Text>
          <Text>
            While on the homepage, check out the browser devTools to see the
            Redux state in action. And check the browser console{" "}
            <Code>__NEXT_DATA__.props.pageProps.initialState</Code> to see the
            prefetched Redux state.
          </Text>
        </section>
      </main>
    </>
  )
}

export default AboutPage
