import React from "react"
import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"
import AsyncThunkCancel from "@/documentation/AsyncThunkCancel.mdx"

const ReduxSsrPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Redux Async Thunk Cancel</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p className="text-3xl font-bold text-center my-8">
          RTK - Async Thunk Cancel Actions & Calls
        </p>
        <Navbar />

        <div className="prose dark:prose-invert max-w-none">
          <AsyncThunkCancel />
        </div>
      </main>
    </>
  )
}

export default ReduxSsrPage
