import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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
  extraReducers: (builder) => {},
})

export const { setValue } = exampleSlice.actions
