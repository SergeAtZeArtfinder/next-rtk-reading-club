import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

import type { User } from "@/types"

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
