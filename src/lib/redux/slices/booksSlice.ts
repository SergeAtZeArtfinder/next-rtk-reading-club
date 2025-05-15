import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"

import type { Book } from "@/types"

interface BooksState {
  data: Book[] | null
  loading: boolean
  error: string | null
}

const initialState: BooksState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const res = await fetch("/api/books")
  if (!res.ok) {
    const errorResponse = await res.json()
    throw new Error(errorResponse.error || "Failed to fetch books")
  }
  const data = await res.json()
  return data.data as Book[]
})

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.data = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      // Merge server state into client state
      return {
        ...state,
        ...action.payload.books,
      }
    })
    builder.addCase(fetchBooks.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchBooks.fulfilled, (state, action: any) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchBooks.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.error.message || "Failed to fetch books"
    })
  },
})
export const { setBooks, setLoading, setError } = booksSlice.actions
export const selectBooks = (state: { books: BooksState }) => state.books.data
export const selectLoading = (state: { books: BooksState }) =>
  state.books.loading
export const selectError = (state: { books: BooksState }) => state.books.error

export default booksSlice.reducer
