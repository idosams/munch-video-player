export interface VideoDataState {
  videoSrc: string
  videoFile: File | null
  duration: number
  currentTime: number
  trimStart: number
  trimEnd: number
  isLoaded: boolean
}

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
  isPreviewMode: boolean
  showOptionsMenu: boolean
}

export interface RootState {
  videoData: VideoDataState
  viewState: ViewState
  videoLibrary: {
    projects: VideoProject[]
    currentProjectId: string | null
  }
}

export interface VideoProject {
  id: string
  name: string
  originalName: string
  duration: number
  createdAt: string
  lastModified: string
  thumbnailUrl?: string
  trimStart: number
  trimEnd: number
  currentTime: number
  isLoaded: boolean
}

export interface SetVideoFilePayload {
  file: File
  url: string
}

export interface SetVideoFileWithStatePayload {
  file: File
  url: string
  trimStart: number
  trimEnd: number
  currentTime: number
}

export interface SetTrimRangePayload {
  start: number
  end: number
}



export interface UseVideoControlsReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  handlePlay: () => void
  handleSeek: (time: number) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleTrimChange: (start: number, end: number) => void
  playTrimmedSection: () => void
  exitPreviewMode: () => void
  removeVideo: () => void
  downloadTrimmedVideo: () => void
}

export type VideoEventHandler = (event: React.SyntheticEvent<HTMLVideoElement>) => void