import Head from "next/head"

import type { NextPage } from "next"

import Navbar from "@/components/about/Navbar"
import AboutRTK from "../../documentation/AboutRTK.mdx"

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>RTK About it</title>
        <meta name="description" content="RTK About it" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className="text-3xl font-bold text-center my-8">
        RTK ( Redux Toolkit ) - About
      </p>
      <Navbar />

      <section className="prose dark:prose-invert max-w-none">
        <AboutRTK />
      </section>
    </>
  )
}

export default AboutPage
