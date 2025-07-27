import { useState, useRef, useEffect } from 'react'
import Timeline from './Timeline'
import './VideoPlayer.css'

const VideoPlayer = () => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [videoSrc, setVideoSrc] = useState('')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setTrimEnd(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoSrc])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (time) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      setCurrentTime(0)
      setTrimStart(0)
      setIsPlaying(false)
    }
  }

  const handleTrimChange = (start, end) => {
    setTrimStart(start)
    setTrimEnd(end)
  }

  const playTrimmedSection = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = trimStart
    video.play()
    setIsPlaying(true)

    const checkTrimEnd = () => {
      if (video.currentTime >= trimEnd) {
        video.pause()
        setIsPlaying(false)
        video.removeEventListener('timeupdate', checkTrimEnd)
      }
    }

    video.addEventListener('timeupdate', checkTrimEnd)
  }

  return (
    <div className="video-player">
      <div className="video-container">
        {!videoSrc ? (
          <div className="upload-area">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="file-input"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="upload-label">
              Choose Video File
            </label>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="video-element"
              src={videoSrc}
              onClick={togglePlayPause}
            />
            <div className="video-overlay">
              <div className="video-controls">
                <button className="control-btn volume-btn">🔊</button>
                <button onClick={togglePlayPause} className="control-btn play-btn">
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div className="time-display">
                  <span className="current-time">
                    {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="separator">/</span>
                  <span className="total-time">
                    {Math.floor(duration / 60).toString().padStart(2, '0')}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {videoSrc && (
        <>
          <Timeline
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            trimStart={trimStart}
            trimEnd={trimEnd}
            onTrimChange={handleTrimChange}
          />
          
          <div className="trim-controls">
            <button onClick={playTrimmedSection} className="trim-play-button">
              Play Trimmed Section
            </button>
            <div className="trim-info">
              <span>Selection: {trimStart.toFixed(1)}s - {trimEnd.toFixed(1)}s ({(trimEnd - trimStart).toFixed(1)}s)</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoPlayer