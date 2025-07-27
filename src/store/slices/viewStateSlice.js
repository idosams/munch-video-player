import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isPlaying: false,
  isDragging: null, // 'start', 'end', or null
  showControls: true,
  isFullscreen: false,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  error: null,
  loading: false,
}

const viewStateSlice = createSlice({
  name: 'viewState',
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying
    },
    setIsDragging: (state, action) => {
      state.isDragging = action.payload
    },
    setShowControls: (state, action) => {
      state.showControls = action.payload
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen
    },
    setVolume: (state, action) => {
      state.volume = Math.max(0, Math.min(1, action.payload))
      state.isMuted = state.volume === 0
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    clearError: (state) => {
      state.error = null
    },
    resetViewState: () => {
      return { ...initialState }
    },
  },
})

export const {
  setIsPlaying,
  togglePlayPause,
  setIsDragging,
  setShowControls,
  toggleFullscreen,
  setVolume,
  toggleMute,
  setPlaybackRate,
  setError,
  setLoading,
  clearError,
  resetViewState,
} = viewStateSlice.actions

export default viewStateSlice.reducer