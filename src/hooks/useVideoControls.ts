import { useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCurrentTime,
  setDuration,
  setVideoFile,
  setTrimRange,
} from '../store/slices/videoDataSlice'
import {
  setIsPlaying,
  togglePlayPause,
  setError,
  setLoading,
} from '../store/slices/viewStateSlice'
import { RootState, UseVideoControlsReturn } from '../types'

export const useVideoControls = (): UseVideoControlsReturn => {
  const dispatch = useDispatch()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const { videoSrc, trimStart, trimEnd } = useSelector(
    (state: RootState) => state.videoData
  )
  const { isPlaying } = useSelector((state: RootState) => state.viewState)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      dispatch(setCurrentTime(video.currentTime))
    }

    const handleLoadedMetadata = () => {
      dispatch(setDuration(video.duration))
      dispatch(setLoading(false))
    }

    const handleEnded = () => {
      dispatch(setIsPlaying(false))
    }

    const handleError = () => {
      dispatch(setError('Failed to load video'))
      dispatch(setLoading(false))
    }

    const handleLoadStart = () => {
      dispatch(setLoading(true))
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
    }
  }, [videoSrc, dispatch])

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    dispatch(togglePlayPause())
  }, [isPlaying, dispatch])

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    dispatch(setCurrentTime(time))
  }, [dispatch])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      dispatch(setVideoFile({ file, url }))
      dispatch(setIsPlaying(false))
    }
  }, [dispatch])

  const handleTrimChange = useCallback((start: number, end: number) => {
    dispatch(setTrimRange({ start, end }))
  }, [dispatch])

  const playTrimmedSection = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = trimStart
    video.play()
    dispatch(setIsPlaying(true))

    const checkTrimEnd = () => {
      if (video.currentTime >= trimEnd) {
        video.pause()
        dispatch(setIsPlaying(false))
        video.removeEventListener('timeupdate', checkTrimEnd)
      }
    }

    video.addEventListener('timeupdate', checkTrimEnd)
  }, [trimStart, trimEnd, dispatch])

  return {
    videoRef,
    handlePlay,
    handleSeek,
    handleFileUpload,
    handleTrimChange,
    playTrimmedSection,
  }
}