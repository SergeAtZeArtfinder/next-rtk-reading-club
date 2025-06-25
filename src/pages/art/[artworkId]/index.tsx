import React from "react"
import type {
  NextPage,
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
} from "next"
import { ParsedUrlQuery } from "querystring"
import Head from "next/head"

interface PageProps {
  artworkId: string
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const artworkId = ctx.query.artworkId as string

  return {
    props: { artworkId },
  }
}

const index: NextPage<PageProps> = ({ artworkId }) => {
  return (
    <>
      <Head>
        <title>Artwork details</title>
        <meta name="description" content="Artwork details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1>Artwork ID: {artworkId}</h1>
      </>
    </>
  )
}

export default index
