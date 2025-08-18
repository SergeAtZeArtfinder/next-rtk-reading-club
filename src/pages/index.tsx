import { useEffect } from "react"
import Head from "next/head"

import type { GetServerSideProps, NextPage } from "next"

import { createAppStore } from "@/lib/redux/store"
import { fetchPosts } from "@/lib/redux/slices/postsSlice"
import { fetchUser } from "@/lib/redux/slices/usersSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

interface PageProps {
  [x: string]: any
}

const HomePage: NextPage<PageProps> = ({}) => {
  const dispatch = useAppDispatch()

  const posts = useAppSelector((s) => s.posts.items)
  const postsStatus = useAppSelector((s) => s.posts.status)

  const user1 = useAppSelector((s) => s.users.byId[1])
  const user1Status = useAppSelector((s) => s.users.statusById[1] || "idle")

  // Example of client-side fetch-on-mount if needed (e.g., after client-only nav or cache clear)
  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts())
    }
    if (user1Status === "idle") {
      dispatch(fetchUser(1))
    }
  }, [postsStatus, user1Status, dispatch])

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <h1>Redux Toolkit + Next.js (Pages Router)</h1>

      <section>
        <h2>Posts ({posts.length})</h2>
        <p>Status: {postsStatus}</p>
        <button
          className="px-2 py-1 bg-green-500 hover:bg-green-600 active:bg-green-700"
          onClick={() => dispatch(fetchPosts())}
        >
          Refetch posts
        </button>
        <ul className="flex gap-2">
          {posts.slice(0, 5).map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>User #1</h2>
        <p>Status: {user1Status}</p>
        <button
          className="px-2 py-1 bg-green-500 hover:bg-green-600 active:bg-green-700"
          onClick={() => dispatch(fetchUser(1))}
        >
          Refetch user #1
        </button>
        {user1 && (
          <div>
            <div>Name: {user1.name}</div>
            <div>Email: {user1.email}</div>
          </div>
        )}
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Create an isolated store instance per-request on the server
  const store = createAppStore()

  // Dispatch multiple thunks on the server (await them!)
  await Promise.all([
    store.dispatch(fetchPosts()),
    store.dispatch(fetchUser(1)),
  ])

  // Pass the fully-populated state to the client
  return {
    props: {
      initialReduxState: store.getState(),
    },
  }
}

export default HomePage
