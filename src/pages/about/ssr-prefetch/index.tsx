import React from "react"
import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"
import ReduxSSR from "@/documentation/ReduxSSR.mdx"

const ReduxSsrPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Redux Prefetch SSR</title>
        <meta name="description" content="Redux Prefetch SSR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className="text-3xl font-bold text-center my-8">
        RTK - Prefetch on SSR
      </p>
      <Navbar />

      <div className="prose dark:prose-invert max-w-none">
        <ReduxSSR />
      </div>
    </>
  )
}

export default ReduxSsrPage
