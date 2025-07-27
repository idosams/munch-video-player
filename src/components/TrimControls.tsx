import { useSelector } from 'react-redux'
import { formatTimeWithMs } from '../utils/videoUtils'
import { RootState } from '../types'
import styles from './VideoPlayer.module.scss'

interface TrimControlsProps {
  onPlayTrimmedSection: () => void
  onExitPreviewMode: () => void
}

export const TrimControls = ({ onPlayTrimmedSection, onExitPreviewMode }: TrimControlsProps) => {
  const { trimStart, trimEnd } = useSelector((state: RootState) => state.videoData)
  const { isPreviewMode } = useSelector((state: RootState) => state.viewState)

  return (
    <div className={styles.trimControls}>
      <div className={styles.trimTimes}>
        <div className={styles.timeItem}>
          <label>Start</label>
          <span>{formatTimeWithMs(trimStart)}</span>
        </div>
        <div className={styles.timeItem}>
          <label>End</label>
          <span>{formatTimeWithMs(trimEnd)}</span>
        </div>
        <div className={styles.timeItem}>
          <label>Duration</label>
          <span>{formatTimeWithMs(trimEnd - trimStart)}</span>
        </div>
      </div>
      <div className={styles.trimActions}>
        <button 
          onClick={onPlayTrimmedSection} 
          className={styles.trimPlayButton}
        >
          Preview Trim
        </button>
        {isPreviewMode && (
          <>
            <span className={styles.previewIndicator}>
              🔄 Preview Mode
            </span>
            <button 
              onClick={onExitPreviewMode} 
              className={styles.exitPreviewButton}
            >
              Exit Preview
            </button>
          </>
        )}
      </div>
    </div>
  )
}