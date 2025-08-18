import React from "react"
import type { NextPage, GetServerSideProps } from "next"
import Head from "next/head"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

interface PageProps {}

const UserPage: NextPage<PageProps> = ({}) => {
  return (
    <>
      <Head>
        <title>Page</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>UserPage</h1>
      </main>
    </>
  )
}

export default UserPage
