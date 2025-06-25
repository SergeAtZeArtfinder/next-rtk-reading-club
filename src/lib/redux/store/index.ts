import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import { exampleSlice } from "../slices/exampleSlice"
import { booksSlice } from "../slices/booksSlice"
import { artworksSlice } from "../slices/artworksSlice"

/**
 * Combine reducers
 */
const rootReducer = combineReducers({
  example: exampleSlice.reducer,
  books: booksSlice.reducer,
  artworks: artworksSlice.reducer,
})

/**
 *  Function to create the store (required by createWrapper)
 */
const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

/**
 * Create the wrapper
 */
export const wrapper = createWrapper(makeStore)

/**
 * Export types for store and dispatch
 */
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"]
