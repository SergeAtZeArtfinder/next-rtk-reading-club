import {
  UnknownAction,
  combineReducers,
  configureStore,
  createAction,
} from "@reduxjs/toolkit"
import postsReducer from "@/lib/redux/slices/postsSlice"
import usersReducer from "@/lib/redux/slices/usersSlice"

const combinedReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
})

// A plain action we'll use to merge server state into the client store.
export const hydrate = createAction<RootState>("app/hydrate")

export type RootState = ReturnType<typeof combinedReducer>

// A tiny, predictable merge: shallow-merge at slice level.
// Server wins for fields it provides; client keeps anything not present in the payload.
// Adjust per-slice merging if you need something fancier.
function rootReducer(
  state: RootState | undefined,
  action: UnknownAction,
): RootState {
  if (hydrate.match(action)) {
    if (!state) return action.payload
    return {
      ...state,
      ...action.payload,
      posts: { ...state.posts, ...action.payload.posts },
      users: { ...state.users, ...action.payload.users },
    }
  }
  return combinedReducer(state, action)
}

export function createAppStore(preloadedState?: RootState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // default middleware is perfect here; async-thunk metas are already ignored by serializableCheck
  })
}

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch =
  ReturnType<AppStore["dispatch"]> extends never
    ? never
    : ReturnType<typeof createAppStore>["dispatch"]
