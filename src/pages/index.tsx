import Head from "next/head"

import type { GetServerSideProps, NextPage } from "next"

interface PageProps {
  [x: string]: any
}

const HomePage: NextPage<PageProps> = ({}) => {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}

export default HomePage
