import React from "react"
import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"
import ReduxMemoizedSelectors from "@/documentation/ReduxMemoizedSelectors.mdx"

const ReduxSsrPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Redux Memoized Selectors</title>
        <meta name="description" content="Redux Memoized Selectors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className="text-3xl font-bold text-center my-8">
        RTK - Memoized Selectors
      </p>
      <Navbar />

      <section className="prose dark:prose-invert max-w-none">
        <ReduxMemoizedSelectors />
      </section>
    </>
  )
}

export default ReduxSsrPage
