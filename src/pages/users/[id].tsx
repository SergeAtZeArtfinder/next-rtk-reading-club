import React from "react"
import Head from "next/head"

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
  const user = useAppSelector((s) => {
    // grab first user found in URL param via hydration
    // this page doesn't need to know the ID on the client if server preloaded it
    const ids = Object.keys(s.users.byId)
    return ids.length ? s.users.byId[Number(ids[0])] : undefined
  })

  if (!user) return <p className="p-6">Loading…</p>

  return (
    <>
      <Head>
        <title>User Page</title>
        <meta name="description" content="User page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>User {user.id}</h1>
        <div>Name: {user.name}</div>
        <div>Email: {user.email}</div>
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
