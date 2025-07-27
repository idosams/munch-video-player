import { useSelector } from 'react-redux'
import { useVideoControls } from '../hooks/useVideoControls'
import { formatTime } from '../utils/videoUtils'
import Timeline from './Timeline'
import styles from './VideoPlayer.module.scss'

const VideoPlayer = () => {
  const { videoRef, handlePlay, handleFileUpload, playTrimmedSection } = useVideoControls()
  
  const { videoSrc, currentTime, duration, trimStart, trimEnd } = useSelector(
    (state) => state.videoData
  )
  const { isPlaying } = useSelector((state) => state.viewState)


  const getTrimDuration = () => {
    return (trimEnd - trimStart).toFixed(1)
  }

  return (
    <div className={styles.videoPlayer}>
      <div className={styles.videoContainer}>
        {!videoSrc ? (
          <div className={styles.uploadArea}>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="video-upload"
            />
            <label htmlFor="video-upload" className={styles.uploadLabel}>
              Choose Video File
            </label>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className={styles.videoElement}
              src={videoSrc}
              onClick={handlePlay}
            />
            <div className={styles.videoOverlay}>
              <div className={styles.videoControls}>
                <button className={styles.controlBtn} aria-label="Volume">
                  🔊
                </button>
                <button 
                  onClick={handlePlay} 
                  className={styles.controlBtn}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div className={styles.timeDisplay}>
                  <span className={styles.currentTime}>
                    {formatTime(currentTime)}
                  </span>
                  <span className={styles.separator}>/</span>
                  <span className={styles.totalTime}>
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {videoSrc && (
        <>
          <Timeline />
          
          <div className={styles.trimControls}>
            <button 
              onClick={playTrimmedSection} 
              className={styles.trimPlayButton}
            >
              Play Trimmed Section
            </button>
            <div className={styles.trimInfo}>
              <span>
                Selection: {trimStart.toFixed(1)}s - {trimEnd.toFixed(1)}s ({getTrimDuration()}s)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoPlayer