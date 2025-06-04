import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"
import { z } from "zod"

import type { Book } from "@/types"
import { schemaCreateBook } from "@/lib/validation"

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

export const deleteBookById = createAsyncThunk<
  Book, // Return type on success
  { bookId: string }, // Argument type
  { rejectValue: string } // Rejection type
>("books/deleteBookById", async ({ bookId }, thunkApi) => {
  const res = await fetch(`/api/books/${bookId}`, {
    method: "DELETE",
  })
  const data = await res.json()
  if (!res.ok || !data.success) {
    return thunkApi.rejectWithValue(data.error || "Failed to delete book")
  }
  return data.data as Book
})

export const postNewBook = createAsyncThunk<
  Book, // Return type on success
  z.infer<typeof schemaCreateBook>, // Argument type
  { rejectValue: string } // Rejection type
>("books/postNewBook", async (input, thunkApi) => {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok || !data.success) {
    return thunkApi.rejectWithValue(data.error || "Failed to create book")
  }
  return data.data as Book
})

export const editBook = createAsyncThunk<
  Book, // Return type on success
  z.infer<typeof schemaCreateBook> & { bookId: string }, // Argument type
  { rejectValue: string } // Rejection type
>("books/editBook", async (input, thunkApi) => {
  const { bookId, ...restInput } = input

  const res = await fetch(`/api/books/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restInput),
  })
  const data = await res.json()
  if (!res.ok || !data.success) {
    return thunkApi.rejectWithValue(data.error || "Failed to update book")
  }
  return data.data as Book
})

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  /**
   * @description fetch books from server, an example of async thunk RTK action
   * @param {unknown|undefined} arg an optional argument that fetch function could have
   * for example `slug` or `userId` to fetch specific book or user
   * @param {GetThunkAPI} thunkApi thunk api object, that could be used to dispatch other actions
   * or get state
   * @link https://redux-toolkit.js.org/api/createAsyncThunk#cancellation
   * @returns {AsyncThunkAction} redux async action
   */
  async (arg, thunkApi) => {
    const res = await fetch("/api/books")
    if (!res.ok) {
      const errorResponse = await res.json()
      throw new Error(errorResponse.error || "Failed to fetch books")
    }
    const data = await res.json()
    return data.data as Book[]
  },
)

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
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to fetch books"
    })

    // Handle postNewBook
    builder.addCase(postNewBook.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(postNewBook.fulfilled, (state, action) => {
      state.loading = false
      if (state.data) {
        state.data = [action.payload, ...state.data]
      } else {
        state.data = [action.payload]
      }
    })
    builder.addCase(postNewBook.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to create book"
    })

    // Handle deleteBookById
    builder.addCase(deleteBookById.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteBookById.fulfilled, (state, action) => {
      state.loading = false
      if (state.data) {
        state.data = state.data.filter((book) => book.id !== action.payload.id)
      }
    })
    builder.addCase(deleteBookById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to delete book"
    })

    // Handle editBook
    builder.addCase(editBook.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(editBook.fulfilled, (state, action) => {
      state.loading = false
      if (state.data) {
        const index = state.data.findIndex(
          (book) => book.id === action.payload.id,
        )
        if (index !== -1) {
          state.data[index] = action.payload
        } else {
          state.data.push(action.payload)
        }
      } else {
        state.data = [action.payload]
      }
    })
    builder.addCase(editBook.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to update book"
    })
  },
})
export const { setBooks, setLoading, setError } = booksSlice.actions
export const selectBooks = (state: { books: BooksState }) => state.books.data
export const selectLoading = (state: { books: BooksState }) =>
  state.books.loading
export const selectError = (state: { books: BooksState }) => state.books.error

export default booksSlice.reducer
