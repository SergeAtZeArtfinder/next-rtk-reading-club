import React, { useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

import type { NextPage, GetServerSideProps } from "next"
import type { ParsedUrlQuery } from "querystring"

import { createAppStore } from "@/lib/redux/store"
import { fetchUser } from "@/lib/redux/slices/usersSlice"
import { useAppSelector } from "@/lib/hooks"

interface Params extends ParsedUrlQuery {
  id: string
}

interface PageProps {}

const UserPage: NextPage<PageProps> = () => {
  const router = useRouter()

  const userId = router.query.id as string
  const user = useAppSelector((s) => {
    return s.users.byId[parseInt(userId, 10)] || undefined
  })

  return (
    <>
      <Head>
        <title>User Page</title>
        <meta name="description" content="User page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {user ? (
          <>
            <h1>User {user.id}</h1>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
          </>
        ) : (
          <p className="p-6">Loading…</p>
        )}
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params as Params
  const userId = parseInt(id, 10)

  const store = createAppStore()

  await store.dispatch(fetchUser(userId))

  return {
    props: {
      initialReduxState: store.getState(),
    },
  }
}

export default UserPage
