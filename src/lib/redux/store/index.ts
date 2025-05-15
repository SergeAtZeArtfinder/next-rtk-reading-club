import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { exampleSlice } from "../slices/exampleSlice"
import { booksSlice } from "../slices/booksSlice"

const rootReducer = combineReducers({
  example: exampleSlice.reducer,
  books: booksSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
