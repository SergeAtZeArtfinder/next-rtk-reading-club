import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"

import type { ArtsApiSearchResponse, ArtworksQueryParams } from "@/types"

import { getArtEndpointUrl, formatArtworksList } from "@/lib/art"

interface ArtworksState {
  data: Pick<ArtsApiSearchResponse, "pagination" | "data"> | null
  loading: boolean
  error: string | null
}

const initialState: ArtworksState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchArtworks = createAsyncThunk<
  Pick<ArtsApiSearchResponse, "pagination" | "data">, // Return type on success
  ArtworksQueryParams, // Argument type
  { rejectValue: string } // Rejection type
>("artworks/fetchArtworks", async (params, thunkApi) => {
  const { page, limit, search } = params
  const url = getArtEndpointUrl({
    page,
    limit,
    search: search ? encodeURIComponent(search) : undefined,
  })
  const res = await fetch(url)
  const responseData = await res.json()
  if (!res.ok) {
    return thunkApi.rejectWithValue(
      responseData.error || "Failed to fetch artworks",
    )
  }
  const { pagination, data } = responseData as ArtsApiSearchResponse

  return {
    pagination,
    data: formatArtworksList(data),
  }
})

export const artworksSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {
    setArtworks: (
      state,
      action: PayloadAction<Pick<ArtsApiSearchResponse, "pagination" | "data">>,
    ) => {
      state.data = action.payload
      state.loading = false
      state.error = null
    },
    setArtworksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
      state.error = null
    },
    setArtworksError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      // Merge server state into client state
      return {
        ...state,
        ...action.payload.artworks,
      }
    }),
      builder.addCase(fetchArtworks.pending, (state) => {
        state.loading = true
        state.error = null
      }),
      builder.addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      }),
      builder.addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch artworks"
      })
  },
})

export const { setArtworks, setArtworksLoading, setArtworksError } =
  artworksSlice.actions
