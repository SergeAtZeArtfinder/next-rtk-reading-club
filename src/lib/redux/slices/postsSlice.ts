import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { Post, Status } from "@/types"

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
