import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../types'
import { logger } from '../utils/logger'

interface VideoThumbnail {
  time: number
  dataUrl: string
  position: number
}

export const useVideoThumbnails = (thumbnailCount: number = 10) => {
  const [thumbnails, setThumbnails] = useState<VideoThumbnail[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { videoSrc, duration } = useSelector((state: RootState) => state.videoData)

  const generateThumbnails = useCallback(async () => {
    if (!videoSrc || !duration || duration <= 0) {
      setThumbnails([])
      return
    }

    setIsGenerating(true)
    const newThumbnails: VideoThumbnail[] = []
    
    try {
      const video = document.createElement('video')
      video.src = videoSrc
      video.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve
        video.onerror = reject
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      canvas.width = 160
      canvas.height = 90

      for (let i = 0; i < thumbnailCount; i++) {
        const time = (i / (thumbnailCount - 1)) * duration
        const position = (i / (thumbnailCount - 1)) * 100

        video.currentTime = time
        
        await new Promise((resolve) => {
          video.onseeked = resolve
        })

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)

        newThumbnails.push({
          time,
          dataUrl,
          position
        })
      }

      setThumbnails(newThumbnails)
    } catch (error) {
      logger.error('Error generating thumbnails', error)
      setThumbnails([])
    } finally {
      setIsGenerating(false)
    }
  }, [videoSrc, duration, thumbnailCount])

  useEffect(() => {
    generateThumbnails()
  }, [generateThumbnails])

  return {
    thumbnails,
    isGenerating,
    regenerateThumbnails: generateThumbnails
  }
}