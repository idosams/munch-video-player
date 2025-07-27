/**
 * Format time in seconds to MM:SS format
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  if (!time || isNaN(time)) return '00:00'
  
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Format time in seconds to HH:MM:SS format for longer videos
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTimeWithHours = (time) => {
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
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value))
}

/**
 * Convert percentage to time
 * @param {number} percentage - Percentage (0-100)
 * @param {number} duration - Total duration in seconds
 * @returns {number} Time in seconds
 */
export const percentageToTime = (percentage, duration) => {
  return (percentage / 100) * duration
}

/**
 * Convert time to percentage
 * @param {number} time - Time in seconds
 * @param {number} duration - Total duration in seconds
 * @returns {number} Percentage (0-100)
 */
export const timeToPercentage = (time, duration) => {
  if (!duration) return 0
  return (time / duration) * 100
}

/**
 * Validate trim range
 * @param {number} start - Start time
 * @param {number} end - End time
 * @param {number} duration - Video duration
 * @param {number} minGap - Minimum gap between start and end
 * @returns {object} Validated trim range
 */
export const validateTrimRange = (start, end, duration, minGap = 0.1) => {
  const clampedStart = clamp(start, 0, duration - minGap)
  const clampedEnd = clamp(end, clampedStart + minGap, duration)
  
  return {
    start: clampedStart,
    end: clampedEnd,
  }
}

/**
 * Generate ruler marks for timeline
 * @param {number} duration - Video duration in seconds
 * @param {number} maxMarks - Maximum number of marks to show
 * @returns {Array} Array of ruler mark objects
 */
export const generateRulerMarks = (duration, maxMarks = 10) => {
  if (!duration) return []
  
  const marks = []
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
 * @param {File} file - Video file
 * @returns {string} Object URL
 */
export const createVideoURL = (file) => {
  return URL.createObjectURL(file)
}

/**
 * Revoke video URL to free memory
 * @param {string} url - Object URL to revoke
 */
export const revokeVideoURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Check if file is a valid video format
 * @param {File} file - File to check
 * @returns {boolean} True if valid video file
 */
export const isValidVideoFile = (file) => {
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