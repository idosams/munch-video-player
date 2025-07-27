import { configureStore } from '@reduxjs/toolkit'
import videoDataReducer from './slices/videoDataSlice'
import viewStateReducer from './slices/viewStateSlice'

export const store = configureStore({
  reducer: {
    videoData: videoDataReducer,
    viewState: viewStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['videoData/setVideoFile'],
        ignoredPaths: ['videoData.videoFile', 'videoData.videoRef'],
      },
    }),
})

// Types would be defined here in a TypeScript file
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch