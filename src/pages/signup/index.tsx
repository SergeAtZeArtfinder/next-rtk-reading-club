import Head from "next/head"

import type { NextPage } from "next"

import SignupForm from "@/components/forms/SignupForm"

const SignupPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up New User</title>
        <meta name="description" content="New User Registration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignupForm />
    </>
  )
}

export default SignupPage
