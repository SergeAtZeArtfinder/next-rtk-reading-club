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
        <meta name="description" content="RTK Install & Setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className="text-3xl font-bold text-center my-8">
        RTK - Install and setup
      </p>
      <Navbar />

      <section className="prose dark:prose-invert max-w-none">
        <Setup />
      </section>
    </>
  )
}

export default InstallSetupPage
