import React from "react"
import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"

const AsyncThunkStatePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>RTK Async Thunk State</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold text-center my-8">
          RTK - Async thunk state
        </h1>
        <Navbar />
      </main>
    </>
  )
}

export default AsyncThunkStatePage
