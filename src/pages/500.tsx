import Image from "next/image"
import Head from "next/head"

import type { NextPage } from "next"

const Custom500page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Server error | 500</title>
        <meta name="description" content="The page server error" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=" h-screen flex flex-col justify-center items-center ">
        <h1 className="text-3xl font-bold text-secondary">Oups!...</h1>
        <Image
          src="/images/ostrich.png"
          alt="ostrich"
          width={400}
          height={400}
          priority
        />
        <p className="text-xl font-semibold my-4">Server error</p>
        <p>
          🤷‍♂️ We are sorry - something has broken our end. Our teams are working
          hard to fix the issue.
        </p>
      </div>
    </>
  )
}

export default Custom500page
