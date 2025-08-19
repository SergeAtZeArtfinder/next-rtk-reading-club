import { useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { Button, Card, CardBody, CardFooter } from "@heroui/react"

import type { GetServerSideProps, NextPage } from "next"

import { createAppStore } from "@/lib/redux/store"
import { fetchPosts } from "@/lib/redux/slices/postsSlice"
import { fetchUser } from "@/lib/redux/slices/usersSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

const status = {
  idle: "🤪",
  loading: "⏳",
  succeeded: "✅",
  failed: "❌",
} as const

interface PageProps {
  [x: string]: any
}

const HomePage: NextPage<PageProps> = ({}) => {
  const dispatch = useAppDispatch()

  const posts = useAppSelector((s) => s.posts.items)
  const postsStatus = useAppSelector((s) => s.posts.status)

  const user1 = useAppSelector((s) => s.users.byId[1])
  const user1Status = useAppSelector((s) => s.users.statusById[1] || "idle")

  /**
   * Example of client-side fetch-on-mount if needed
   * (e.g., after client-only nav or cache clear)
   */
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
        <title>Redux Toolkit + Next.js</title>
      </Head>
      <h1 className="text-3xl font-bold mb-8">
        Redux Toolkit + Next.js (Pages Router)
      </h1>

      <section>
        <h2 className="my-4 text-2xl font-bold text-center">User #1</h2>
        <div className="flex gap-4 items-center">
          <p className="my-4 text-xl font-semibold">
            Status: {status[user1Status]}
          </p>
          <Button
            size="sm"
            className=" bg-green-500 hover:bg-green-600 active:bg-green-700"
            onPress={() => dispatch(fetchUser(1))}
          >
            Refetch user #1
          </Button>
        </div>
        {user1 && (
          <Card className="mb-4">
            <CardBody className="flex flex-row gap-2">
              <div className="border-r-1 border-gray-300 pr-4">
                <p>Name: {user1.name}</p>
                <p>Email: {user1.email}</p>
              </div>
              <div className="px-4 border-r-1 border-gray-300">
                <p>Company: &quot;{user1.company.name}&quot;</p>
                <p>About: &quot;{user1.company.catchPhrase}&quot;</p>
              </div>
              <div className="px-4 ">
                <p>City: {user1.address.city}</p>
                <p>
                  Address: {user1.address.street}, {user1.address.suite},{" "}
                  {user1.address.zipcode}
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </section>

      <section>
        <h2 className="mt-8 mb-4 text-2xl font-bold text-center">
          Posts ({posts.length})
        </h2>
        <div className="flex gap-4 items-center">
          <p className="my-4 text-xl font-semibold">
            Status: {status[postsStatus]}
          </p>
          <Button
            size="sm"
            className=" bg-green-500 hover:bg-green-600 active:bg-green-700"
            onPress={() => dispatch(fetchPosts())}
          >
            Refetch posts
          </Button>
        </div>
        <ul className="grid grid-cols-gallery gap-2">
          {posts.slice(0, 15).map((post) => (
            <Card as="li" key={post.id}>
              <CardBody>
                <p className="text-sm mb-2">{post.title}</p>
              </CardBody>
              <CardFooter>
                <Button
                  size="sm"
                  as={Link}
                  href={`/users/${post.userId}`}
                  className=" bg-green-500 hover:bg-green-600 active:bg-green-700"
                >
                  View User
                </Button>
              </CardFooter>
            </Card>
          ))}
        </ul>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  /**
   * Create an isolated store instance per-request on the server
   */
  const store = createAppStore()

  /**
   * Dispatch multiple thunks on the server (await them!)
   */
  await Promise.all([
    store.dispatch(fetchPosts()),
    store.dispatch(fetchUser(1)),
  ])

  /**
   * Pass the fully-populated state to the client
   */
  return {
    props: {
      initialReduxState: store.getState(),
    },
  }
}

export default HomePage
