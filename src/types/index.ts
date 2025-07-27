// Video Data Types
export interface VideoDataState {
  videoSrc: string
  videoFile: File | null
  duration: number
  currentTime: number
  trimStart: number
  trimEnd: number
  isLoaded: boolean
}

// View State Types
export interface ViewState {
  isPlaying: boolean
  isDragging: 'start' | 'end' | null
  showControls: boolean
  isFullscreen: boolean
  volume: number
  isMuted: boolean
  playbackRate: number
  error: string | null
  loading: boolean
}

// Root State Type
export interface RootState {
  videoData: VideoDataState
  viewState: ViewState
}

// Action Payload Types
export interface SetVideoFilePayload {
  file: File
  url: string
}

export interface SetTrimRangePayload {
  start: number
  end: number
}

// Component Props Types
export interface TimelineProps {
  // All props come from Redux store, no external props needed
}

export interface VideoPlayerProps {
  // All props come from Redux store, no external props needed
}

// Hook Return Types
export interface UseVideoControlsReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  handlePlay: () => void
  handleSeek: (time: number) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleTrimChange: (start: number, end: number) => void
  playTrimmedSection: () => void
}

// Utility Types
export interface RulerMark {
  time: number
  position: number
  key: number
}

export interface TrimRange {
  start: number
  end: number
}

// Event Handler Types
export type VideoEventHandler = (event: React.SyntheticEvent<HTMLVideoElement>) => void
export type MouseEventHandler = (event: React.MouseEvent) => void
export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void

// Constants
export const VIDEO_ACTIONS = {
  SET_VIDEO_FILE: 'videoData/setVideoFile',
  SET_DURATION: 'videoData/setDuration',
  SET_CURRENT_TIME: 'videoData/setCurrentTime',
  SET_TRIM_START: 'videoData/setTrimStart',
  SET_TRIM_END: 'videoData/setTrimEnd',
  SET_TRIM_RANGE: 'videoData/setTrimRange',
  RESET_VIDEO: 'videoData/resetVideo',
} as const

export const VIEW_ACTIONS = {
  SET_IS_PLAYING: 'viewState/setIsPlaying',
  TOGGLE_PLAY_PAUSE: 'viewState/togglePlayPause',
  SET_IS_DRAGGING: 'viewState/setIsDragging',
  SET_SHOW_CONTROLS: 'viewState/setShowControls',
  TOGGLE_FULLSCREEN: 'viewState/toggleFullscreen',
  SET_VOLUME: 'viewState/setVolume',
  TOGGLE_MUTE: 'viewState/toggleMute',
  SET_PLAYBACK_RATE: 'viewState/setPlaybackRate',
  SET_ERROR: 'viewState/setError',
  SET_LOADING: 'viewState/setLoading',
  CLEAR_ERROR: 'viewState/clearError',
  RESET_VIEW_STATE: 'viewState/resetViewState',
} as const