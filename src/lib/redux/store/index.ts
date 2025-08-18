import { configureStore, combineReducers } from "@reduxjs/toolkit"

import { exampleSlice } from "../slices/exampleSlice"

/**
 * Combine reducers
 */
const rootReducer = combineReducers({
  example: exampleSlice.reducer,
})

/**
 *  Function to create the store (required by createWrapper)
 */
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

/**
 * Export types for store and dispatch
 */
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"]
