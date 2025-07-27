import { TrimRange, RulerMark } from '../types'

/**
 * Format time in seconds to MM:SS format
 * @param time - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (time: number): string => {
  if (!time || isNaN(time)) return '00:00'
  
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Format time in seconds to HH:MM:SS format for longer videos
 * @param time - Time in seconds
 * @returns Formatted time string
 */
export const formatTimeWithHours = (time: number): string => {
  if (!time || isNaN(time)) return '00:00:00'
  
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

/**
 * Convert percentage to time
 * @param percentage - Percentage (0-100)
 * @param duration - Total duration in seconds
 * @returns Time in seconds
 */
export const percentageToTime = (percentage: number, duration: number): number => {
  return (percentage / 100) * duration
}

/**
 * Convert time to percentage
 * @param time - Time in seconds
 * @param duration - Total duration in seconds
 * @returns Percentage (0-100)
 */
export const timeToPercentage = (time: number, duration: number): number => {
  if (!duration) return 0
  return (time / duration) * 100
}

/**
 * Validate trim range
 * @param start - Start time
 * @param end - End time
 * @param duration - Video duration
 * @param minGap - Minimum gap between start and end
 * @returns Validated trim range
 */
export const validateTrimRange = (start: number, end: number, duration: number, minGap: number = 0.1): TrimRange => {
  const clampedStart = clamp(start, 0, duration - minGap)
  const clampedEnd = clamp(end, clampedStart + minGap, duration)
  
  return {
    start: clampedStart,
    end: clampedEnd,
  }
}

/**
 * Generate ruler marks for timeline
 * @param duration - Video duration in seconds
 * @param maxMarks - Maximum number of marks to show
 * @returns Array of ruler mark objects
 */
export const generateRulerMarks = (duration: number, maxMarks: number = 10): RulerMark[] => {
  if (!duration) return []
  
  const marks: RulerMark[] = []
  let interval = 1
  
  // Determine appropriate interval based on duration
  if (duration <= 30) interval = 5
  else if (duration <= 120) interval = 10
  else if (duration <= 600) interval = 30
  else interval = 60
  
  // Adjust interval to keep marks under maxMarks
  while (duration / interval > maxMarks) {
    interval *= 2
  }
  
  for (let i = 0; i <= Math.ceil(duration / interval); i++) {
    const time = i * interval
    if (time > duration) break
    
    const position = timeToPercentage(time, duration)
    marks.push({ time, position, key: i })
  }
  
  return marks
}

/**
 * Create a video URL from file
 * @param file - Video file
 * @returns Object URL
 */
export const createVideoURL = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Revoke video URL to free memory
 * @param url - Object URL to revoke
 */
export const revokeVideoURL = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Check if file is a valid video format
 * @param file - File to check
 * @returns True if valid video file
 */
export const isValidVideoFile = (file: File): boolean => {
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/mov',
    'video/avi',
    'video/mkv'
  ]
  
  return validTypes.includes(file.type)
}