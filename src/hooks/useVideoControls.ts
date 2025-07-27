import { useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { formatTime } from '../utils/videoUtils'
import { logger } from '../utils/logger'
import {
  setCurrentTime,
  setDuration,
  setVideoFile,
  setTrimRange,
  resetVideo,
} from '../store/slices/videoDataSlice'
import {
  setIsPlaying,
  togglePlayPause,
  setError,
  setLoading,
  setIsPreviewMode,
} from '../store/slices/viewStateSlice'
import { RootState, UseVideoControlsReturn } from '../types'

export const useVideoControls = (): UseVideoControlsReturn => {
  const dispatch = useDispatch()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const { videoSrc, trimStart, trimEnd } = useSelector(
    (state: RootState) => state.videoData
  )
  const { isPlaying, playbackRate, isPreviewMode, volume, isMuted } = useSelector((state: RootState) => state.viewState)


  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime
      dispatch(setCurrentTime(currentTime))
      
      if (isPreviewMode && currentTime >= trimEnd - 0.001) {
        video.pause()
        dispatch(setIsPlaying(false))
      }
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
    
    video.playbackRate = playbackRate
    video.volume = isMuted ? 0 : volume
    video.muted = isMuted

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
    }
  }, [videoSrc, playbackRate, isPreviewMode, trimEnd, trimStart, volume, isMuted, dispatch])

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      if (isPreviewMode) {
        video.currentTime = trimStart
      }
      video.play()
    }
    dispatch(togglePlayPause())
  }, [isPlaying, isPreviewMode, trimStart, dispatch])

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    if (video.readyState < 1) {
      const handleLoadedMetadata = () => {
        video.currentTime = time
        dispatch(setCurrentTime(time))
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return
    }

    video.currentTime = time
    dispatch(setCurrentTime(time))
  }, [dispatch, videoSrc])

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

    dispatch(setIsPreviewMode(true))
    video.currentTime = trimStart
    video.play()
    dispatch(setIsPlaying(true))
  }, [trimStart, dispatch])

  const exitPreviewMode = useCallback(() => {
    dispatch(setIsPreviewMode(false))
  }, [dispatch])

  const removeVideo = useCallback(() => {
    dispatch(resetVideo())
    dispatch(setIsPlaying(false))
    dispatch(setIsPreviewMode(false))
  }, [dispatch])

  const downloadTrimmedVideo = useCallback(async () => {
    if (!videoSrc) return

    try {
      dispatch(setError(null))
      dispatch(setLoading(true))

      const ffmpeg = new FFmpeg()
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })

      const videoData = await fetchFile(videoSrc)
      await ffmpeg.writeFile('input.mp4', videoData)

      const duration = trimEnd - trimStart
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', trimStart.toString(),
        '-t', duration.toString(),
        '-c', 'copy',
        '-avoid_negative_ts', 'make_zero',
        'output.mp4'
      ])

      const trimmedData = await ffmpeg.readFile('output.mp4')
      const blob = new Blob([trimmedData], { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trimmed-${formatTime(trimStart)}-to-${formatTime(trimEnd)}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.mp4')
      dispatch(setLoading(false))
      
    } catch (error) {
      logger.error('Error trimming video', error)
      dispatch(setError(`Failed to trim video: ${error instanceof Error ? error.message : 'Unknown error'}`))
      dispatch(setLoading(false))
    }
  }, [videoSrc, trimStart, trimEnd, dispatch])

  return {
    videoRef,
    handlePlay,
    handleSeek,
    handleFileUpload,
    handleTrimChange,
    playTrimmedSection,
    exitPreviewMode,
    removeVideo,
    downloadTrimmedVideo,
  }
}