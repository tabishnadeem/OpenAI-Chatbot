import { configureStore } from '@reduxjs/toolkit'
import loaderReducer from "./redux/loaderSlice"
import convoThreadReducer from "./redux/conversationThreadSlice"
export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    convoThread: convoThreadReducer

  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch