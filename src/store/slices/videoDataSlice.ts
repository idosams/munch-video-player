import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VideoDataState, SetVideoFilePayload, SetVideoFileWithStatePayload, SetTrimRangePayload } from '../../types'

const initialState: VideoDataState = {
  videoSrc: '',
  videoFile: null,
  duration: 0,
  currentTime: 0,
  trimStart: 0,
  trimEnd: 0,
  isLoaded: false,
}

const videoDataSlice = createSlice({
  name: 'videoData',
  initialState,
  reducers: {
    setVideoFile: (state, action: PayloadAction<SetVideoFilePayload>) => {
      state.videoFile = action.payload.file
      state.videoSrc = action.payload.url
      state.currentTime = 0
      state.trimStart = 0
      state.isLoaded = false
    },
    setVideoFileWithState: (state, action: PayloadAction<SetVideoFileWithStatePayload>) => {
      state.videoFile = action.payload.file
      state.videoSrc = action.payload.url
      state.currentTime = action.payload.currentTime
      state.trimStart = action.payload.trimStart
      state.trimEnd = action.payload.trimEnd
      state.isLoaded = false
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
      if (state.trimEnd === 0) {
        state.trimEnd = action.payload
      }
      state.isLoaded = true
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    setTrimStart: (state, action: PayloadAction<number>) => {
      state.trimStart = Math.max(0, Math.min(action.payload, state.trimEnd - 0.1))
    },
    setTrimEnd: (state, action: PayloadAction<number>) => {
      state.trimEnd = Math.max(state.trimStart + 0.1, Math.min(action.payload, state.duration))
    },
    setTrimRange: (state, action: PayloadAction<SetTrimRangePayload>) => {
      const { start, end } = action.payload
      state.trimStart = Math.max(0, Math.min(start, state.duration))
      state.trimEnd = Math.max(state.trimStart + 0.1, Math.min(end, state.duration))
    },
    resetVideo: () => {
      return { ...initialState }
    },
  },
})

export const {
  setVideoFile,
  setVideoFileWithState,
  setDuration,
  setCurrentTime,
  setTrimStart,
  setTrimEnd,
  setTrimRange,
  resetVideo,
} = videoDataSlice.actions

export const videoDataReducer = videoDataSlice.reducer