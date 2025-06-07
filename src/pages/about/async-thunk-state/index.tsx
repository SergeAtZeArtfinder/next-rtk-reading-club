import React from "react"
import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"
import AsyncThunkState from "../../../documentation/AsyncThunkState.mdx"

const AsyncThunkStatePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>RTK Async Thunk State</title>
        <meta name="description" content="RTK Async Thunk State" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold text-center my-8">
        RTK - Async thunk state
      </h1>
      <Navbar />

      <section className="prose dark:prose-invert max-w-none">
        <AsyncThunkState />
      </section>
    </>
  )
}

export default AsyncThunkStatePage
