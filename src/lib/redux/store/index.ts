import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { exampleSlice } from "../slices/exampleSlice"

const rootReducer = combineReducers({
  example: exampleSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
