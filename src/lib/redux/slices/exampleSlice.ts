import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"

interface ExampleState {
  value: string
}

const initialState: ExampleState = {
  value: "Hello, Redux!",
}

export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      // Merge server state into client state
      return {
        ...state,
        ...action.payload.example,
      }
    })
  },
})

export const { setValue } = exampleSlice.actions
