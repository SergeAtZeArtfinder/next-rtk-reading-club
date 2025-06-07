import Head from "next/head"

import type { NextPage } from "next"

import SignInForm from "@/components/forms/SignInForm"

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign In User</title>
        <meta name="description" content="Sign In User" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignInForm />
    </>
  )
}

export default SignInPage
