# Redux Toolkit Setup for Next.js
Here’s a clean, no-wrapper pattern for using Redux Toolkit with the Next.js Pages Router that supports:

- Multiple slices, each fetching data via createAsyncThunk
- Server-side dispatch of async thunks in getServerSideProps
- Passing the server store state to the page and hydrating on the client with your own action
- Optional client-side fetching and refetching

## Install

```sh
npm i @reduxjs/toolkit react-redux
```

## Basic Folder layout

```sh
/src
  /redux
    store.ts
    hooks.ts
    /features
      /posts/postsSlice.ts
      /users/usersSlice.ts
/pages
  _app.tsx
  index.tsx
  /users/[id].tsx

```

## Redux store with custom HYDRATE action

`src/redux/store.ts`

```ts
import {
  UnknownAction,
  combineReducers,
  configureStore,
  createAction,
} from "@reduxjs/toolkit"
import postsReducer from "@/lib/redux/slices/postsSlice"
import usersReducer from "@/lib/redux/slices/usersSlice"

const combinedReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
})

// A plain action we'll use to merge server state into the client store.
export const hydrate = createAction<RootState>("app/hydrate")

export type RootState = ReturnType<typeof combinedReducer>

// A tiny, predictable merge: shallow-merge at slice level.
// Server wins for fields it provides; client keeps anything not present in the payload.
// Adjust per-slice merging if you need something fancier.
function rootReducer(
  state: RootState | undefined,
  action: UnknownAction,
): RootState {
  if (hydrate.match(action)) {
    if (!state) return action.payload
    return {
      ...state,
      ...action.payload,
      posts: { ...state.posts, ...action.payload.posts },
      users: { ...state.users, ...action.payload.users },
    }
  }
  return combinedReducer(state, action)
}

export function createAppStore(preloadedState?: RootState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // default middleware is perfect here; async-thunk metas are already ignored by serializableCheck
  })
}

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch =
  ReturnType<AppStore["dispatch"]> extends never
    ? never
    : ReturnType<typeof createAppStore>["dispatch"]
```

`src/redux/hooks.ts`

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "./store"
import type { RootState } from "./store"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

## Slices with createAsyncThunk (multiple data sources)

A. Posts slice
`src/redux/slices/postsSlice.ts`

```ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Post = { id: number; title: string; body: string }

type Status = "idle" | "loading" | "succeeded" | "failed"

interface PostsState {
  items: Post[]
  status: Status
  error: string | null
}

const initialState: PostsState = {
  items: [],
  status: "idle",
  error: null,
}

// Example fetch; swap in your real API:
export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchPosts",
  async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    if (!res.ok) throw new Error("Failed to fetch posts")
    return (await res.json()) as Post[]
  },
)

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // optional local reducers
    clearPosts(state) {
      state.items = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Unknown error"
      })
  },
})

export const { clearPosts } = postsSlice.actions
export default postsSlice.reducer
```

B. Users slice
`src/redux/features/users/usersSlice.ts`

```ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type User = { id: number; name: string; email: string }

type Status = "idle" | "loading" | "succeeded" | "failed"

interface UsersState {
  byId: Record<number, User>
  statusById: Record<number, Status>
  errorById: Record<number, string | null>
}

const initialState: UsersState = {
  byId: {},
  statusById: {},
  errorById: {},
}

export const fetchUser = createAsyncThunk<User, number>(
  "users/fetchUser",
  async (userId: number) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`,
    )
    if (!res.ok) throw new Error(`Failed to fetch user ${userId}`)
    return (await res.json()) as User
  },
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        const id = action.meta.arg
        state.statusById[id] = "loading"
        state.errorById[id] = null
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        const user = action.payload
        state.byId[user.id] = user
        state.statusById[user.id] = "succeeded"
      })
      .addCase(fetchUser.rejected, (state, action) => {
        const id = action.meta.arg as number
        state.statusById[id] = "failed"
        state.errorById[id] = action.error.message ?? "Unknown error"
      })
  },
})

export default usersSlice.reducer
```

4. App entry: create the store once, hydrate on navigation
   `pages/_app.tsx`

```tsx
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { createAppStore, hydrate, AppStore } from "@/src/redux/store"
import { useRef } from "react"

export default function MyApp({ Component, pageProps }: AppProps) {
  const storeRef = useRef<AppStore>()

  // 1) First client render: create store with server-preloaded state (if present)
  if (!storeRef.current) {
    storeRef.current = createAppStore(pageProps.initialReduxState)
  }
  // 2) Subsequent client-side navigations: merge any new server state
  else if (pageProps.initialReduxState) {
    storeRef.current.dispatch(hydrate(pageProps.initialReduxState))
  }

  return (
    <Provider store={storeRef.current!}>
      <Component {...pageProps} />
    </Provider>
  )
}
```

5. Page with server prefetch of multiple slices + client refetch
   `pages/index.tsx`

```tsx
import { useEffect } from "react"
import { GetServerSideProps } from "next"
import { createAppStore } from "@/src/redux/store"
import { fetchPosts } from "@/src/redux/slices/postsSlice"
import { fetchUser } from "@/src/redux/slices/usersSlice"
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"

export default function HomePage() {
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
    <main>
      <h1>Redux Toolkit + Next.js (Pages Router)</h1>

      <section>
        <h2>Posts ({posts.length})</h2>
        <p>Status: {postsStatus}</p>
        <button onClick={() => dispatch(fetchPosts())}>Refetch posts</button>
        <ul>
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
        <button onClick={() => dispatch(fetchUser(1))}>Refetch user #1</button>
        {user1 && (
          <div>
            <div>Name: {user1.name}</div>
            <div>Email: {user1.email}</div>
          </div>
        )}
      </section>
    </main>
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
```

6. A second page that prefetches different slice data
   `pages/users/[id].tsx`

```tsx
import { GetServerSideProps } from "next"
import { ParsedUrlQuery } from "querystring"
import { createAppStore } from "@/src/redux/store"
import { fetchUser } from "@/src/redux/slices/usersSlice"
import { useAppSelector } from "@/src/redux/hooks"

interface Params extends ParsedUrlQuery {
  id: string
}

export default function UserPage() {
  const user = useAppSelector((s) => {
    // grab first user found in URL param via hydration
    // this page doesn't need to know the ID on the client if server preloaded it
    const ids = Object.keys(s.users.byId)
    return ids.length ? s.users.byId[Number(ids[0])] : undefined
  })

  if (!user) return <p>Loading…</p>

  return (
    <main>
      <h1>User {user.id}</h1>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
    </main>
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
```

7. Why this pattern is robust:

- No wrappers: we create the store in getServerSideProps, dispatch thunks, and pass store.getState() straight to the page.
- Transparent hydration: \_app.tsx owns a single store instance and merges server-provided state via a tiny hydrate action.
- Multiple slices: each slice uses its own createAsyncThunk; SSR can prefetch any combination (posts + users here) and client can refetch as needed.
- Serializable: state is plain JSON, so Next can serialize it in pageProps.
- Per-request isolation: server store is created fresh for each request; no cross-user leakage.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Due to next.js v14, react v19, and other peer deps to install run with flag :

```sh
npm install --legacy-peer-deps
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Artworks API docs

- https://api.artic.edu/docs/#quick-start
- https://api.artic.edu/api/v1/openapi.json

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
