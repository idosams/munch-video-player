// Video Data Types
export const VideoDataState = {
  videoSrc: '',
  videoFile: null,
  duration: 0,
  currentTime: 0,
  trimStart: 0,
  trimEnd: 0,
  isLoaded: false,
}

// View State Types
export const ViewState = {
  isPlaying: false,
  isDragging: null, // 'start' | 'end' | null
  showControls: true,
  isFullscreen: false,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  error: null,
  loading: false,
}

// Action Types
export const VIDEO_ACTIONS = {
  SET_VIDEO_FILE: 'videoData/setVideoFile',
  SET_DURATION: 'videoData/setDuration',
  SET_CURRENT_TIME: 'videoData/setCurrentTime',
  SET_TRIM_START: 'videoData/setTrimStart',
  SET_TRIM_END: 'videoData/setTrimEnd',
  SET_TRIM_RANGE: 'videoData/setTrimRange',
  RESET_VIDEO: 'videoData/resetVideo',
}

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
}