import React from "react"
import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"
import Setup from "@/documentation/Setup.mdx"

const InstallSetupPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>RTK Install & Setup</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold text-center my-8">
          RTK - Install and setup
        </h1>
        <Navbar />

        <div className="prose dark:prose-invert max-w-none">
          <Setup />
        </div>
      </main>
    </>
  )
}

export default InstallSetupPage
