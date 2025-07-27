import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ViewState } from '../../types'

const initialState: ViewState = {
  isPlaying: false,
  isDragging: null,
  showControls: true,
  isFullscreen: false,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  error: null,
  loading: false,
  isPreviewMode: true,
  showOptionsMenu: false,
}

const viewStateSlice = createSlice({
  name: 'viewState',
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying
    },
    setIsDragging: (state, action: PayloadAction<'start' | 'end' | null>) => {
      state.isDragging = action.payload
    },
    setShowControls: (state, action: PayloadAction<boolean>) => {
      state.showControls = action.payload
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload))
      state.isMuted = state.volume === 0
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    clearError: (state) => {
      state.error = null
    },
    setIsPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload
    },
    toggleOptionsMenu: (state) => {
      state.showOptionsMenu = !state.showOptionsMenu
    },
    setShowOptionsMenu: (state, action: PayloadAction<boolean>) => {
      state.showOptionsMenu = action.payload
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
  setIsPreviewMode,
  toggleOptionsMenu,
  setShowOptionsMenu,
  resetViewState,
} = viewStateSlice.actions

export const viewStateReducer = viewStateSlice.reducer